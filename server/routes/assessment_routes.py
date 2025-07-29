from flask_restful import Resource
from flask import request, make_response
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import Assessment, Submission, User
from extensions import db
from routes.clas_routes import AssessmentSchema
import json
from datetime import datetime, timezone

assessment_schema = AssessmentSchema()

class AssessmentById(Resource):
    @jwt_required()
    def get(self, id):
        assessment = Assessment.query.get(id)
        if not assessment:
            return {"error": "Assessment not found"}, 404
        return make_response(assessment_schema.dump(assessment), 200)

    @jwt_required()
    def post(self, id):
        # Student submits answers
        current_user = json.loads(get_jwt_identity())
        user = User.query.get(current_user['id'])
        data = request.get_json()
        answers = data.get('answers')
        started_at = data.get('started_at')
        ended_at = datetime.now(timezone.utc)
        if not answers:
            return {"error": "Answers required"}, 400
        submission = Submission(
            assessment_id=id,
            student_id=user.id,
            submitted_at=ended_at,
            answers=answers,
        )
        db.session.add(submission)
        db.session.commit()
        return make_response({"message": "Submission saved"}, 201)

