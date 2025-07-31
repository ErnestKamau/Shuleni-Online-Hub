from flask import request
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_restful import Resource
from extensions import db, bcrypt
from datetime import datetime, timezone



class SchoolStats(Resource):
    @jwt_required()
    def get(self):
        current_user = get_jwt_identity()
        
        
        if current_user['role'] != 'owner':
            return {"error": "Unauthorized"}, 403
            
        try:
            from models import User, Student, Teacher
            
            school_id = current_user['school_id']
            
            
            total_students = Student.query.filter_by(school_id=school_id).count()
            total_educators = Teacher.query.filter_by(school_id=school_id).count()
            total_users = User.query.filter_by(school_id=school_id).count()
            
            
            from datetime import datetime, timedelta
            thirty_days_ago = datetime.now(timezone.utc) - timedelta(days=30)
            
            recent_students = Student.query.filter(
                Student.school_id == school_id,
                Student.created_at >= thirty_days_ago
            ).count()
            
            recent_educators = Teacher.query.filter(
                Teacher.school_id == school_id,
                Teacher.created_at >= thirty_days_ago
            ).count()
            
            return {
                "total_students": total_students,
                "total_educators": total_educators,
                "total_users": total_users,
                "recent_students": recent_students,
                "recent_educators": recent_educators,
                "school_id": school_id
            }, 200
            
        except Exception as e:
            return {"error": str(e)}, 500