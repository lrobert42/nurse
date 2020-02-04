import typing

from marshmallow import Schema, fields, missing as missing_, post_load
from flask_restplus import abort
from flask import request


class FlaskSchema(Schema):
    """Marshmallow schema with ordered field as default, validation errors wrapped in Http 422 errors, partial nested field flattening."""

    class Meta(object):
        ordered = True

    def handle_error(self, err, data, **kwargs):
        """Wrap validation errors in a http 422 error."""
        abort(422, "Validation error", errs=err.messages)

    def load_request(
        self,
        many: bool = None,
        partial: typing.Union[bool, typing.Sequence[str], typing.Set[str]] = None,
        unknown: str = None
    ):
        """Load the JSON body of a request."""
        return self.load(request.get_json(), many=many, partial=partial, unknown=unknown)

    @post_load
    def flatten_partial_nested(self, obj, many, partial):
        """If partial loading is enabled, and a nested field is partially describe, flatten it.

        Examples:
        ---------
        sc = Schema.from_dict({
            "foo": fields.Nested(Schema.from_dict({"bar": field.Int(), "baz": field.Str()})
        })
        sc.load({"foo":{"bar"=5}})
        # {"foo__bar":5}
        """
        if partial:
            for basename, field in self.fields.items():
                if isinstance(field, fields.Nested):
                    subfields = set(field.schema._declared_fields)
                    missing = subfields - set(obj[basename])
                    if missing:
                        for subname, val in obj[basename].items():
                            obj[f"{basename}__{subname}"] = val
                        del obj[basename]
        return obj


class RidSchema(FlaskSchema):
    """See FlaskSchema. Define dump only rid field."""
    rid = fields.Int(strict=True, dump_only=True, description=f"This resource identifier (automaticaly assigned upon resource creation).")


class RidField(fields.Field):
    """Transparent (de)serializing between an rid and the correspondinig document.

    Usage
    -----
    user = RidField(UserModel, data_key="user_rid")
    # here we expect to deserialize a json with a "user_rid" key, after loading the serialized object contains a key "user" containing
    # the UserModel document identified by "user_rid" value.

    Params
    ------
        rid_model: Type[RidDocument]
            A subclass of RidDocument
    """

    def __init__(
        self,
        rid_model,
        *,
        default: typing.Any = missing_,
        missing: typing.Any = missing_,
        data_key: str = None,
        attribute: str = None,
        validate: typing.Union[
            typing.Callable[[typing.Any], typing.Any],
            typing.Sequence[typing.Callable[[typing.Any], typing.Any]],
            typing.Generator[typing.Callable[[typing.Any], typing.Any], None, None],
        ] = None,
        required: bool = False,
        allow_none: bool = None,
        load_only: bool = False,
        dump_only: bool = False,
        error_messages: typing.Dict[str, str] = None,
        **metadata
    ) -> None:
        super().__init__(
            default=default, missing=missing, data_key=data_key, attribute=attribute, validate=validate,
            required=required, allow_none=allow_none, load_only=load_only, dump_only=dump_only, error_messages=error_messages,
            **metadata
        )
        self.rid_model = rid_model

    def _serialize(self, value, attr, obj, **kwargs):
        if value is None:
            return None
        return value.rid

    def _deserialize(self, value, attr, data, **kwargs):
        if value is None:
            return None
        return self.rid_model.with_rid(value)


# Register custom field in flask_accepts type mapping as int field

import flask_accepts as fa

fa.utils.type_map[RidField] = fa.utils.type_map[fields.Int]
