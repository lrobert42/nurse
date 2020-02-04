from datetime import date

from flask import request as r
from flask_accepts import accepts, responds
from flask_jwt_extended import jwt_required
from flask_restplus import Namespace, Resource

from .models import TreatmentModel, TreatmentSchema
from ..auth.utils import manager_required
from ..common.query_language import filter_args, Fields


ns = Namespace("treatments", description="Treatments related operations")


@ns.route("/")
class Treatments(Resource):

    @filter_args(Fields.int("patient"), Fields.date("date"), api=ns)
    @responds(schema=TreatmentSchema(many=True), api=ns)
    @jwt_required
    def get(self):
        """Get all treatments."""
        return TreatmentModel.objects

    @accepts(schema=TreatmentSchema(many=True), api=ns)
    @responds(schema=TreatmentSchema(many=True), api=ns)
    @manager_required
    def post(self):
        """Create a new treatment."""
        return TreatmentModel.objects.insert([TreatmentModel(**doc) for doc in r.parsed_obj])


@ns.route("/<int:rid>")
@ns.doc(params={"rid": "The nurse rid (index start from 1)"})
class Treatment(Resource):

    @responds(schema=TreatmentSchema(), api=ns)
    @jwt_required
    def get(self, rid):
        """Get a treatment."""
        return TreatmentModel.with_rid(rid)

    @accepts(schema=TreatmentSchema(partial=True), api=ns)
    @responds(schema=TreatmentSchema(), api=ns)
    @manager_required
    def post(self, rid):
        """(Partially) update a treatment."""
        treatment = TreatmentModel.with_rid(rid)
        treatment.modify(**r.parsed_obj)
        return treatment

    @manager_required
    def delete(self, rid):
        """Delete a treatment."""
        TreatmentModel.with_rid(rid).delete()
        return {}, 204
