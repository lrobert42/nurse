from marshmallow import fields
from mongoengine import DateTimeField, DateField, SequenceField, ReferenceField

from ..common.models import RidDocument
from ..common.marshmallow_utils import RidSchema, RidField
from ..nurses.models import NurseModel
from ..patients.models import PatientModel
from ..treatment_types.models import TreatmentTypeModel


class TreatmentModel(RidDocument):
    rid = SequenceField(unique=True)  # Overriding to use own counter rather than the one common to all RidDocument childs.
    patient = ReferenceField(PatientModel, required=True)
    ttype = ReferenceField(TreatmentTypeModel, required=True)
    date = DateField(required=True)
    time = DateTimeField(default=None)
    nurse = ReferenceField(NurseModel, default=None)


class TreatmentSchema(RidSchema):
    __model__ = TreatmentModel
    patient = RidField(PatientModel, required=True)
    ttype = RidField(TreatmentTypeModel, required=True)
    date = fields.Date(required=True)
    time = fields.DateTime(dump_only=True)
    nurse = RidField(NurseModel, dump_only=True)


class _TreatmentSchemaLoadAll(RidSchema):
    __model__ = TreatmentModel
    patient = RidField(PatientModel, required=True)
    ttype = RidField(TreatmentTypeModel, required=True)
    date = fields.Date(required=True)
    time = fields.DateTime()
    nurse = RidField(NurseModel)
