import datetime
import copy

from mongoengine import (StringField, DateTimeField, SequenceField, ReferenceField, EmbeddedDocumentField,
                         ListField, EmbeddedDocument, ValidationError)
from marshmallow import fields, validate, post_load, pre_dump
from flask_restplus import abort

from ..common.models import RidDocument, AddressModel, AddressSchema
from ..common.marshmallow_utils import RidSchema, RidField, FlaskSchema
from ..nurses.models import NurseModel
from ..treatment_types.models import TreatmentTypeModel


# class TreatmentModel(EmbeddedDocument):
#     ttype = ReferenceField(TreatmentTypeModel, required=True)
#     start = DateTimeField(required=True)
#     end = DateTimeField(required=True)
#     scheduled_start = DateTimeField()
#     nurse = ReferenceField(NurseModel)

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
#         if isinstance(other, TreatmentModel):
#             return self.start < other.start
#         return NotImplemented


# class TreatmentSchema(FlaskSchema):
#     __model__ = TreatmentModel
#     ttype = RidField(TreatmentTypeModel, required=True)
#     start = fields.DateTime(required=True, description="Format [yyyy]-[mm]-[dd]T[hh]:[mm]:[ss], example: '2020-01-25T18:44:05'.")
#     end = fields.DateTime(required=True, description="Format [yyyy]-[mm]-[dd]T[hh]:[mm]:[ss], example: '2020-01-25T18:44:05'.")
#     scheduled_start = fields.DateTime(dump_only=True, description="Format [yyyy]-[mm]-[dd]T[hh]:[mm]:[ss], example: '2020-01-25T18:44:05'.")
#     nurse = RidField(NurseModel, dump_only=True, description="Assigned nurse rid")


# class _TreamentSchemaLoadAll(FlaskSchema):
#     __model__ = TreatmentModel
#     ttype = RidField(TreatmentTypeModel, required=True)
#     start = fields.DateTime(required=True, description="Format [yyyy]-[mm]-[dd]T[hh]:[mm]:[ss], example: '2020-01-25T18:44:05'.")
#     end = fields.DateTime(required=True, description="Format [yyyy]-[mm]-[dd]T[hh]:[mm]:[ss], example: '2020-01-25T18:44:05'.")
#     scheduled_start = fields.DateTime(description="Format [yyyy]-[mm]-[dd]T[hh]:[mm]:[ss], example: '2020-01-25T18:44:05'.")
#     nurse = RidField(NurseModel)


# class TreatmentAgendaModel(EmbeddedDocument):
#     entries = SortedListField(EmbeddedDocumentField(TreatmentModel), ordering="start", default=list)

#     def append(self, val, one_entry_per_day=True):
#         """Add an agenda entry if and only if start is inferior to end,
#         they're both in the same day and doesn't intersect with any existing entry.

#         Args
#         ----
#             val: the new entry dict to append
#             one_entry_per_day (default: True):
#                 If True, raise a ValidationError if an existing entry share the same day (even if they don't intersect)
#         """
#         new_entry = TreatmentModel(**val)
#         new_entry.clean()
#         self.entries.append(new_entry)
#         self.entries.sort()
#         return new_entry

#     def modify(self, idx, val, only_if_unassigned=True):
#         """Update the agenda entry at index `idx` with `val` content."""
#         if idx < 0:
#             abort(400, "Invalid index")
#         if idx >= len(self.entries):
#             abort(404, f"Out-of-range index {idx} on list size {len(self.entries)}")

#         entry = self.entries[idx]

#         if only_if_unassigned and getattr(entry, "scheduled_start", None) is not None:
#             abort(400, "Cannot modify assigned treatments !")

#         for k, v in val.items():
#             entry[k] = v
#         self.entries.sort()
#         return entry

#     def first(self, pred, reverse=False):
#         """Returns the index and TreatmentModel object of the first entry for which the predicate `pred` is True.
#         Returns (-1, None) if the predicate is False for all entries

#         Args
#         ----
#             pred: Func[TreatmentModel] -> Bool
#                 predicate on TreatmentModel instances
#             reverse: bool
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
#         # 1, TreatmentModel(..)
#         agenda.first(lambda doc: doc.date() == datetime(2019, 1, 24)) # first entry of 24-Jan-2019
#         # 1, TreatmentModel(..)
#         """
#         for i, doc in enumerate(self.entries):
#             if pred(doc):
#                 return i, doc
#         return -1, None

#     def all(self, pred):
#         """Returns the indexes and TreatmentModel objects of all the entries for which the predicate `pred` is True.

#         Args
#         ----
#             pred: Func[TreatmentModel] -> Bool
#                 predicate on TreatmentModel instances

#         Example
#         -------
#         from datetime import datetime
#         agenda = AgendaModel(entries={
#             {"start": datetime(2019, 1, 24, 12), "end": datetime(2019, 1, 24, 13)},
#             {"start": datetime(2019, 1, 25, 12), "end": datetime(2019, 1, 25, 13)},
#             {"start": datetime(2019, 1, 25, 15), "end": datetime(2019, 1, 25, 16)},
#         })
#         agenda.all(lambda doc: doc.date() == datetime(2019, 1, 2)) # all entries of 25-Jan-2019
#         # [(1, TreatmentModel(..)), 2, TreatmentModel(...))]
#         """
#         res = list()
#         for i, doc in enumerate(self.entries):
#             if pred(doc):
#                 res.append((i, doc))

#     def day(self, date: datetime.date):
#         """Return all the entries for the given day"""
#         return self.all(lambda doc: doc.date() == date)


# class PatientModel(RidDocument):
#     rid = SequenceField(unique=True)  # Overriding to use own counter rather than the one common to all RidDocument childs.
#     name = StringField(min_lenght=1, max_length=255, required=True)
#     address = EmbeddedDocumentField(AddressModel, required=True)
#     treatments = EmbeddedDocumentField(TreatmentAgendaModel, required=True)


# class PatientSchema(RidSchema):
#     __model__ = PatientModel
#     name = fields.Str(validate=validate.Length(1, 255), required=True)
#     address = fields.Nested(AddressSchema, required=True)
#     treatments = fields.List(fields.Nested(TreatmentSchema), required=True)

#     @post_load
#     def add_entries_level(self, data, many=False, partial=False):
#         if "treatments" in data:
#             data["treatments"] = {"entries": data["treatments"]}
#         return data

#     @pre_dump
#     def remove_entries_level(self, data, many=False, partial=False):
#         data["treatments"] = data["treatments"]["entries"]
#         return data


# class _PatientSchemaLoadAll(RidSchema):
#     __model__ = PatientModel
#     name = fields.Str(validate=validate.Length(1, 255), required=True)
#     address = fields.Nested(AddressSchema, required=True)
#     treatments = fields.List(fields.Nested(_TreamentSchemaLoadAll), required=True)

#     @post_load
#     def add_entries_level(self, data, many=False, partial=False):
#         if "treatments" in data:
#             data["treatments"] = {"entries": data["treatments"]}
#         return data

#     @pre_dump
#     def remove_entries_level(self, data, many=False, partial=False):
#         data["treatments"] = data["treatments"]["entries"]
#         return data


class PatientModel(RidDocument):
    rid = SequenceField(unique=True)  # Overriding to use own counter rather than the one common to all RidDocument childs.
    name = StringField(min_lenght=1, max_length=255, required=True)
    address = EmbeddedDocumentField(AddressModel, required=True)
    # treatments = ListField(ReferenceField(TreatmentModel), required=True)


class PatientSchema(RidSchema):
    __model__ = PatientModel
    name = fields.String(validate=validate.Length(1, 255), required=True)
    address = fields.Nested(AddressSchema, required=True)
    # treatments = fields.List(RidField(TreatmentModel), required=True)


# def filter_treatments(
#         data,
#         startdate: datetime.datetime,
#         duration: datetime.datetime = "day",
#         filter_empty_treatments: bool = True,
#         filter_assigned: bool = True):
#     """Returns patients with filtered treatments list.

#     Args
#     ----
#         data: List or Dict
#             A single or a list of nurse dictionnary like object(s)
#         startdate: datetime.datetime
#             Treatments list will only contains entries from that day included.
#         duration (default: "nextday"): datetime.timedelta or str
#             Treatments list will only contains entries up to `startdate` + `duration` excluded.
#         filter_empty_treatments (default: True): bool
#             If True patients with empty treatment list for the given time period are filtered out.
#         filter_assinged (default: True): bool
#             If True assigned treatments will be filtered out, even if their part of the time period.
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
#         for patient in data:
#             filtered = filter_treatments(patient, startdate, duration)
#             if filter_empty_treatments and not filtered["treatments"]:
#                 continue
#             ret.append(filtered)
#     else:
#         ret = copy.deepcopy(data)
#         ret["treatments"] = [
#             entry for entry in ret["treatments"]
#             if (datetime.datetime.fromisoformat(entry["start"]) >= startdate and
#                 datetime.datetime.fromisoformat(entry["end"]) <= startdate + duration) and
#                (not filter_assigned or 'nurse' not in entry or entry['nurse'] is None)

#         ]

#     return ret