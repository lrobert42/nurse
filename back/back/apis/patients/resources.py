from flask import request
from flask_restplus import Namespace, Resource, abort
from flask_accepts import responds, accepts

from .models import PatientModel, PatientSchema
from ..auth.utils import manager_or_owner_required, manager_required, get_jwt_claims


ns = Namespace("patients", description="Patients related operations")


@ns.route("/")
class Patients(Resource):

    @responds(schema=PatientSchema(many=True), api=ns)
    @manager_required
    def get(self):
        """Get all patients."""
        return PatientModel.objects

    @accepts(schema=PatientSchema(), api=ns)
    @responds(schema=PatientSchema(), api=ns)
    @manager_required
    def post(self):
        """Add a new patient."""
        patient = PatientModel(**request.parsed_obj)
        patient.save()
        return patient


@ns.route("/<int:rid>")
@ns.doc(params={"rid": "The patient rid (index start from 1)"})
class Patient(Resource):

    @responds(schema=PatientSchema(), api=ns)
    @manager_or_owner_required
    def get(self, rid):
        """Get a single patient."""
        return PatientModel.with_rid(rid)

    @accepts(schema=PatientSchema(partial=True), api=ns)
    @responds(schema=PatientSchema(), api=ns)
    @manager_or_owner_required
    def put(self, rid):
        """Update a patient."""
        patient = PatientModel.with_rid(rid)
        args = request.parsed_obj
        if get_jwt_claims()["usertype"] != 0 and "user" in args:
            raise abort(403, "Not allowed to change user_rid")
        patient.modify(**args)
        return patient

    @manager_required
    def delete(self, rid):
        """Delete a patient."""
        PatientModel.with_rid(rid).delete()
        return {}, 204


# @ns.route("/<int:rid>/treatments")
# @ns.doc(params={"rid": "The patient rid (index start from 1)"})
# class PatientTreatments(Resource):

#     @responds(schema=TreatmentSchema(many=True), api=ns)
#     @manager_or_owner_required
#     def get(self, rid):
#         """Get a patient treatments."""
#         return PatientModel.with_rid(rid).treatments.entries

#     @accepts(schema=TreatmentSchema, api=ns)
#     @responds(schema=TreatmentSchema, api=ns)
#     @manager_required
#     def post(self, rid):
#         """Add an entry to the treatments."""
#         patient = PatientModel.with_rid(rid)
#         added = patient.treatments.append(request.parsed_obj)
#         patient.save()
#         return added


# @ns.route("/<int:rid>/treatments/<int:idx>")
# @ns.doc(params={"rid": "The patient rid (index start from 1)"})
# @ns.doc(params={"idx": "The treatment index in the list (index start from 0)"})
# class PatientTreatmentEntry(Resource):
#     """Handles individual patient treatments entries."""

#     @staticmethod
#     def _check_idx(treatments, idx):
#         if idx >= len(treatments) or idx < 0:
#             abort(404, "Treatment entry not found.")

#     @responds(schema=TreatmentSchema(), api=ns)
#     @manager_or_owner_required
#     def get(self, rid, idx):
#         """Get a single patient treatment."""
#         entries = PatientModel.with_rid(rid).treatments.entries
#         self._check_idx(entries, idx)
#         return entries[idx]

#     @accepts(schema=TreatmentSchema(exclude=("nurse", "scheduled_start"), partial=True), api=ns)
#     @responds(schema=TreatmentSchema(), api=ns)
#     @manager_or_owner_required
#     def put(self, rid, idx):
#         """Update a single patient treatment. Scheduled treatments cannot be updated!"""
#         patient = PatientModel.with_rid(rid)
#         self._check_idx(patient.treatments.entries, idx)
#         modified = patient.treatments.modify(idx, request.parsed_obj)
#         patient.save()
#         return modified

#     @manager_or_owner_required
#     def delete(self, rid, idx):
#         """Delete a single treatment entry."""
#         patient = PatientModel.with_rid(rid)
#         self._check_idx(patient.treatments.entries, idx)
#         del patient.treatments.entries[idx]
#         patient.save()
#         return {}, 204
