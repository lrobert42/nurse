import datetime
import copy

from mongoengine import (StringField, DateTimeField, SequenceField, ReferenceField, EmbeddedDocumentField,
                         ListField, SortedListField, EmbeddedDocument, ValidationError)
from marshmallow import fields, validate, post_load, pre_dump
from flask_restplus import abort

from ..common.utils import find_duplicates
from ..common.models import AddressModel, AddressSchema, RidDocument
from ..common.marshmallow_utils import RidSchema, RidField, FlaskSchema
from ..users.models import UserModel
from ..treatment_types.models import TreatmentTypeModel


# class AgendaDayModel(EmbeddedDocument):
#     start = DateTimeField(required=True)
#     end = DateTimeField(required=True)

#     def clean(self):
#         if self.start.date() != self.end.date():
#             raise ValidationError(message="start and end datetime must correspond to the same day.")
#         if self.start >= self.end:
#             raise ValidationError(message="start field must be inferior to end field")

#     def intersect(self, other):
#         return self.end > other.start and other.end > self.start

#     def date(self) -> datetime.date:
#         return self.start.date()

#     def __lt__(self, other):
#         if isinstance(other, AgendaDayModel):
#             return self.start < other.start
#         return NotImplemented


# class AgendaDaySchema(FlaskSchema):
#     __model__ = AgendaDayModel
#     start = fields.DateTime(required=True, description="Format [yyyy]-[mm]-[dd]T[hh]:[mm]:[ss], example: '2020-01-25T18:44:05'.")
#     end = fields.DateTime(required=True, description="Format [yyyy]-[mm]-[dd]T[hh]:[mm]:[ss], example: '2020-01-25T18:44:05'.")


# class AgendaModel(EmbeddedDocument):
#     entries = SortedListField(EmbeddedDocumentField(AgendaDayModel), ordering="start", default=list)

#     def append(self, val, one_entry_per_day=True):
#         """Add an agenda entry if and only if start is inferior to end,
#         they're both in the same day and doesn't intersect with any existing entry.

#         Args
#         ----
#             val: the new entry dict to append
#             one_entry_per_day (default: True):
#                 If True, raise a ValidationError if an existing entry share the same day (even if they don't intersect)
#         """
#         new_entry = AgendaDayModel(**val)
#         new_entry.clean()
#         for entry in self.entries:
#             if entry.intersect(new_entry):
#                 raise ValidationError("Cannot add agenda entry that intersects with an existing entry.")
#             if one_entry_per_day and entry.date() == new_entry.date():
#                 raise ValidationError(f"An agenda entry already exist for the day: {new_entry.date().isoformat()}")

#         self.entries.append(new_entry)
#         self.entries.sort()
#         return new_entry

#     def modify(self, idx, val):
#         """Update the agenda entry at index `idx` with `val` content."""
#         if idx < 0:
#             abort(400, "Invalid index")
#         if idx >= len(self.entries):
#             abort(404, f"Out-of-range index {idx} on list size {len(self.entries)}")

#         entry = self.entries[idx]
#         for k, v in val.items():
#             entry[k] = v
#         self.entries.sort()
#         return entry

#     def first(self, pred, reverse=False):
#         """Returns the index and AgendaDayModel object of the first entry for which the predicate `pred` is True.
#         Returns (-1, None) if the predicate is False for all entries

#         Args
#         ----
#             pred: Func[AgendaDayModel] -> Bool
#                 predicate on AgendaDayModel instances
#             reverse (default: None): bool
#                 if True iterate from end to beggining of the list

#         Example
#         -------
#         from datetime import datetime
#         agenda = AgendaModel(entries={
#             {"start": datetime(2019, 1, 24, 12), "end": datetime(2019, 1, 24, 13)},
#             {"start": datetime(2019, 1, 25, 12), "end": datetime(2019, 1, 25, 13)},
#             {"start": datetime(2019, 1, 25, 15), "end": datetime(2019, 1, 25, 16)},
#         })
#         agenda.first(lambda doc: doc.end > datetime(2019, 1, 25, 8))  # first entry ending after 25-Jan-2019 8:00:00
#         # 1, AgendaDayModel(..)
#         agenda.first(lambda doc: doc.start.date() == datetime(2019, 1, 24)) # first entry of 24-Jan-2019
#         # 1, AgendaDayModel(..)
#         """
#         for i, doc in enumerate(self.entries):
#             if pred(doc):
#                 return i, doc
#         return -1, None

#     def all(self, pred):
#         """Returns the indexes and AgendaDayModel objects of all the entries for which the predicate `pred` is True.

#         Args
#         ----
#             pred: Func[AgendaDayModel] -> Bool
#                 predicate on AgendaDayModel instances

#         Example
#         -------
#         from datetime import datetime
#         agenda = AgendaModel(entries={
#             {"start": datetime(2019, 1, 24, 12), "end": datetime(2019, 1, 24, 13)},
#             {"start": datetime(2019, 1, 25, 12), "end": datetime(2019, 1, 25, 13)},
#             {"start": datetime(2019, 1, 25, 15), "end": datetime(2019, 1, 25, 16)},
#         })
#         agenda.all(lambda doc: doc.start.date() == datetime(2019, 1, 2)) # all entries of 25-Jan-2019
#         # [(1, AgendaDayModel(..)), 2, AgendaDayModel(...))]
#         """
#         res = list()
#         for i, doc in enumerate(self.entries):
#             if pred(doc):
#                 res.append((i, doc))
#         return res

#     def day(self, date: datetime.date):
#         """Return all the entries for the given day"""
#         return self.all(lambda doc: doc.start.date() == date)


# class NurseModel(RidDocument):
#     rid = SequenceField(unique=True)  # Overriding to use own counter rather than the one common to all RidDocument childs.
#     user = ReferenceField(UserModel, required=True, unique=True)
#     name = StringField(min_lenght=1, max_length=255, required=True)
#     address = EmbeddedDocumentField(AddressModel, required=True)
#     treatment_types = ListField(ReferenceField(TreatmentTypeModel, required=False), default=list)
#     agenda = EmbeddedDocumentField(AgendaModel, required=True)


# class NurseSchema(RidSchema):
#     __model__ = NurseModel
#     user = RidField(rid_model=UserModel, required=True, description="The user RID to associate with the new nurse")
#     name = fields.Str(validate=validate.Length(1, 255), required=True)
#     address = fields.Nested(AddressSchema, required=True)
#     treatment_types = fields.List(RidField(TreatmentTypeModel, required=False), required=True, description="List of treatment_types RIDs")
#     agenda = fields.List(fields.Nested(AgendaDaySchema), required=True)

#     @post_load
#     def add_entries_level(self, data, many=False, partial=False):
#         if "agenda" in data:
#             data["agenda"] = {"entries": data["agenda"]}
#         return data

#     @pre_dump
#     def remove_entries_level(self, data, many=False, partial=False):
#         data["agenda"] = data["agenda"]["entries"]
#         return data


# def filter_agenda(data, startdate: datetime.datetime, duration: datetime.datetime = "day", filter_empty_agenda: bool = True):
#     """Returns nurses with filtered agenda.

#     Args
#     ----
#         data: List or Dict
#             A single or a list of nurse dictionnary like object(s)
#         startdate: datetime.datetime
#             Agenda will only contains agenda entries from that day included.
#         duration (default: "nextday"): datetime.timedelta or str
#             Agenda will only contains agenda entries up to `startdate` + `duration` excluded.
#         filter_empty_agenda (default: True): bool
#             If True nurses with empty agendas are filter out.
#     """
#     ret = None
#     if isinstance(duration, str):
#         if duration == "day":
#             duration = datetime.timedelta(days=1)
#         elif duration == "week":
#             duration = datetime.timedelta(days=7)
#         else:
#             raise ValueError("Duration must be an instance of datetime.timedelta or either 'day' or 'week'.")
#     if isinstance(data, list):
#         ret = list()
#         for nurse in data:
#             filtered = filter_agenda(nurse, startdate, duration)
#             if filter_empty_agenda and not filtered["agenda"]:
#                 continue
#             ret.append(filtered)
#     else:
#         ret = copy.deepcopy(data)
#         ret["agenda"] = [
#             entry for entry in ret["agenda"]
#             if datetime.datetime.fromisoformat(entry["start"]) >= startdate and
#             datetime.datetime.fromisoformat(entry["end"]) <= startdate + duration
#         ]

#     return ret


class NurseModel(RidDocument):
    rid = SequenceField(unique=True)  # Overriding to use own counter rather than the one common to all RidDocument childs.
    user = ReferenceField(UserModel, required=True, unique=True)
    name = StringField(min_lenght=1, max_length=255, required=True)
    address = EmbeddedDocumentField(AddressModel, required=True)
    treatment_types = ListField(ReferenceField(TreatmentTypeModel, required=False), default=list)
    agenda = SortedListField(DateTimeField(), required=True)

    def clean(self):
        errs = dict()
        self.agenda.sort()
        for i in range(len(self.agenda) - 1):
            if self.agenda[i].date() == self.agenda[i + 1].date():
                errs["agenda"] = "Can only have one agenda per day!"

        duplicates = find_duplicates(self.treatment_types)
        if duplicates:
            errs["treatment_types"] = f"Treatment types list cannot contains duplicate elements."

        if errs:
            raise ValidationError(errors=errs)


class AgendaSchema(FlaskSchema):
    agenda = fields.List(
        fields.DateTime, required=True,
        description="List of this nurse work start times, can only contains one element for a given day."
    )

    @post_load
    def to_list(self, data, **kwargs):
        """Convert the dict with a single list field `agenda` to the list itself."""
        print(data["agenda"])
        return data["agenda"]

    @pre_dump
    def to_dict(self, data, **kwargs):
        """Convert the list to a dict with a single list field `agenda`."""
        return {"agenda": data}


class NurseSchema(RidSchema):
    __model__ = NurseModel
    user = RidField(rid_model=UserModel, required=True, description="The user RID to associate with the new nurse")
    name = fields.Str(validate=validate.Length(1, 255), required=True)
    address = fields.Nested(AddressSchema, required=True)
    treatment_types = fields.List(RidField(TreatmentTypeModel, required=False), required=True, description="List of treatment_types RIDs")
    agenda = fields.List(
        fields.DateTime, required=True,
        description="List of this nurse work start times, can only contains one element for a given day."
    )
