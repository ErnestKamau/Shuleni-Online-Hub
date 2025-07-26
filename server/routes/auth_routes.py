from flask import request
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_restful import Resource
from models import User, Student, Teacher, School
from extensions import db, bcrypt
from datetime import datetime, timezone
import secrets
import string
import json
from models import Class, ClassMember, Assessment, Submission, Attendance
from datetime import datetime, timedelta


class SchoolOwnerRegister(Resource):
    def post(self):
        data = request.get_json()
        email = data.get('email')
        
        if User.query.filter( User.email==email ).first():
            return {"error": "Email already exists"}, 409
        
        required_fields = ['full_name', 'email', 'password', 'school_name']
        for field in required_fields:
            if not data.get(field):
                return {"error": f"{field} cannot be empty"}, 400
            
        # password_hashed = bcrypt.generate_password_hash(data['password']).decode('utf-8')
        
        # Create school first
        school = School(
            name=data['school_name'],
            description=data.get('description', ''),
            created_at=datetime.now(timezone.utc)
        )
        db.session.add(school)
        db.session.flush()  # Get school ID
        
      
        # Create owner user
        user = User(
            email=data['email'],
            full_name=data['full_name'],
            role='owner',
            school_id=school.id,
            first_login=False,
            created_at=datetime.now(timezone.utc)
        )
        user.password_hash = data['password']
        
        # Update school owner_id
        school.owner_id = user.id
        
        db.session.add(user)
        db.session.commit()
        
        return {"message": "School and owner created successfully"}, 201
    


class AdminCreateStudent(Resource):
    """Admin creates student accounts"""
    @jwt_required()
    def post(self):
        current_user = json.loads(get_jwt_identity())
        
        # Only owners can create students
        if current_user['role'] != 'owner' :
            return {"error": "Unauthorized"}, 403
            
        data = request.get_json()
        
        required_fields = ['full_name', 'admission_number']
        for field in required_fields:
            if not data.get(field):
                return {"error": f"{field} cannot be empty"}, 400
        
        # Determine which school_id to use
        if data.get('school_id'):
            # Manual school_id provided - validate owner has access to this school
            target_school_id = data['school_id']
            school = School.query.filter_by(id=target_school_id, owner_id=current_user['id']).first()
            if not school:
                return {"error": "School not found or unauthorized access"}, 403
        else:
            # Use owner's default school_id
            target_school_id = current_user['school_id']
        
        # Check if admission number already exists in the target school
        existing_student = Student.query.filter_by(
            admission_number=data['admission_number'],
            school_id=target_school_id
        ).first()
        
        if existing_student:
            return {"error": "Admission number already exists"}, 409
        
        # Generate temporary password
        temp_password = self.generate_temp_password()
        # password_hashed = bcrypt.generate_password_hash(temp_password).decode('utf-8')
        
        # Create user account
        user = User(
            full_name=data['full_name'],
            email=f"{data['admission_number']}@gmail.com",  # Temporary email
            role='student',
            school_id=target_school_id,
            first_login=True,  # Set first_login flag to True
            created_at=datetime.now(timezone.utc)
        )
        user.password_hash = temp_password
       
        db.session.add(user)
        db.session.flush()
       
        # Create student profile
        student = Student(
            user_id=user.id,
            school_id=target_school_id,
            admission_number=data['admission_number'],
            grade=data.get('grade'), # Optional - can be None initially
            class_id=data.get('class_id'), # Optional - can be None initially
            created_at=datetime.now(timezone.utc)
        )
        
        db.session.add(student)
        db.session.commit()
        
        return {
            "message": "Student created successfully",
            "admission_number": data['admission_number'],
            "temporary_password": temp_password,
            "student_id": student.id
        }, 201
    
    def generate_temp_password(self):
        """Generate a secure temporary password"""
        length = 8
        characters = string.ascii_letters + string.digits
        return ''.join(secrets.choice(characters) for _ in range(length))
    
    

class AdminCreateEducator(Resource):
    """Admin creates educator accounts"""
    @jwt_required()
    def post(self):
        current_user = json.loads(get_jwt_identity())
        
        # Only owners can create educators
        if current_user['role'] != 'owner':
            return {"error": "Unauthorized"}, 403
            
        data = request.get_json()
        
        required_fields = ['full_name', 'school_email', 'tsc_number']
        for field in required_fields:
            if not data.get(field):
                return {"error": f"{field} cannot be empty"}, 400
        
        # Determine which school_id to use
        if data.get('school_id'):
            # Manual school_id provided - validate owner has access to this school
            target_school_id = data['school_id']
            school = School.query.filter_by(id=target_school_id, owner_id=current_user['id']).first()
            if not school:
                return {"error": "School not found or unauthorized access"}, 403
        else:
            # Use owner's default school_id
            target_school_id = current_user['school_id']
        
        # Check if email already exists
        if User.query.filter_by(email=data['school_email']).first():
            return {"error": "Email already exists"}, 409
        
        # Generate temporary password
        temp_password = self.generate_temp_password()
        # password_hashed = bcrypt.generate_password_hash(temp_password).decode('utf-8')
        
        # Create user account
        user = User(
            full_name=data['full_name'],
            email=data['school_email'],
            role='educator',
            school_id=target_school_id,
            first_login=True,  # Set first_login flag to True
            created_at=datetime.now(timezone.utc)
        )
        user.password_hash = temp_password
        
        db.session.add(user)
        db.session.flush()
        
        # Create teacher profile
        teacher = Teacher(
            name=data['full_name'],
            user_id=user.id,
            school_id=target_school_id,
            tsc_number=data['tsc_number'],
            class_id=data.get('class_id'),
            created_at=datetime.now(timezone.utc)
        )
        
        db.session.add(teacher)
        db.session.commit()
        
        return {
            "message": "Educator created successfully",
            "school_email": data['school_email'],
            "temporary_password": temp_password,
            "teacher_id": teacher.id
        }, 201
    
    def generate_temp_password(self):
        """Generate a secure temporary password"""
        length = 8
        characters = string.ascii_letters + string.digits
        return ''.join(secrets.choice(characters) for _ in range(length))


class CreateSchool(Resource):
    """Create a new school - typically used by super admin or system admin"""
    @jwt_required()
    def post(self):
        current_user = json.loads(get_jwt_identity())
        data = request.get_json()
        
        if current_user['role'] != 'owner':
            return {"error": "Unauthorized"}, 403
        
        required_fields = ['name']
        for field in required_fields:
            if not data.get(field):
                return {"error": f"{field} cannot be empty"}, 400
        
        
        existing_school = School.query.filter_by(name=data['name']).first()
        if existing_school:
            return {"error": "School name already exists"}, 409
        
       
        school = School(
            name=data['name'],
            description=data.get('description', ''),
            address=data.get('address', ''),
            created_at=datetime.now(timezone.utc),
            owner_id=current_user['id']
        )
        
        db.session.add(school)
        db.session.commit()
        
        return {
            "message": "School created successfully",
            "school_id": school.id,
            "school_name": school.name,
            "description": school.description,
            "address": school.address
        }, 201



class Login(Resource):
    """Universal login for all user types"""
    def post(self):
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')
        
        if not username or not password:
            return {"error": "Username and password are required"}, 400
        
        user = None
        
    
        user = User.query.filter_by(email=username).first()
       
        
        if not user:
            student = Student.query.filter_by(admission_number=username).first()
            if student:
                print("Found student:", student)
                print("Student.user:", student.user)
                user = student.user
        
        if user and user.authenticate(password):
            
            identity = {
                "id": user.id,
                "role": user.role,
                "school_id": user.school_id,
                "full_name": user.full_name
            }
            
            
            if user.role == 'student':
                identity["admission_number"] = user.student_profile.admission_number
            elif user.role == 'educator':
                identity["school_email"] = user.email
                
            token = create_access_token(identity=json.dumps(identity))
            
            return {
                'token': token,
                'role': user.role,
                'full_name': user.full_name,
                'id': user.id,
                'school_id': user.school_id,
                'email': user.email if user.role != 'student' else None,
                'admission_number': user.student_profile.admission_number if user.role == 'student' else None,
                'first_login': user.first_login 
            }, 200
        
        
        
        return {'error': 'Invalid credentials'}, 401


class ChangePassword(Resource):
    """Allow users to change their password after first login"""
    @jwt_required()
    def post(self):
        current_user = json.loads(get_jwt_identity())
        data = request.get_json()
        
        old_password = data.get('old_password')
        new_password = data.get('new_password')
        
        if not old_password or not new_password:
            return {"error": "Old password and new password are required"}, 400
        
        user = User.query.get(current_user['id'])
        if not user:
            return {"error": "User not found"}, 404
        
        if not user.authenticate(old_password):
            return {"error": "Invalid old password"}, 401
        
        # Hash new password
        # new_password_hashed = bcrypt.generate_password_hash(new_password).decode('utf-8')
        user.password_hash = new_password
        
        # Reset first_login flag to False after successful password change
        user.first_login = False
        
        db.session.commit()
        
        return {"message": "Password changed successfully"}, 200

class UserProfile(Resource):
    """Get current user profile"""
    @jwt_required()
    def get(self):
        current_user = json.loads(get_jwt_identity())
        
        user = User.query.get(current_user['id'])
        if not user:
            return {"error": "User not found"}, 404
        
        profile_data = {
            "id": user.id,
            "full_name": user.full_name,
            "email": user.email,
            "role": user.role,
            "school_id": user.school_id,
            "created_at": user.created_at.isoformat()
        }
        
        # Add role-specific data
        if user.role == 'student' and user.student_profile:
            profile_data.update({
                'admission_number': getattr(user.student_profile, 'admission_number', None) if user.role == 'student' else None,
                "grade": user.student_profile.grade,
                "class_id": user.student_profile.class_id
            })
        elif user.role == 'educator' and user.teacher_profile:
            profile_data.update({
                "tsc_number": user.teacher_profile.tsc_number,
                "class_id": user.teacher_profile.class_id
            })
        
        return profile_data, 200


class StudentDashboard(Resource):
    @jwt_required()
    def get(self):
        current_user = get_jwt_identity()
        user = User.query.get(current_user['id'])
        if not user or user.role != 'student':
            return {"error": "Unauthorized"}, 403

        # Get student profile
        student_profile = user.student_profile
        if not student_profile:
            return {"error": "Student profile not found"}, 404

        # School info
        school = School.query.get(student_profile.school_id)
        school_data = {
            "id": school.id,
            "name": school.name,
            "address": school.address
        } if school else None

        # Classes (via ClassMember)
        class_memberships = ClassMember.query.filter_by(user_id=user.id, role_in_class='student').all()
        class_ids = [cm.class_id for cm in class_memberships]
        classes = Class.query.filter(Class.id.in_(class_ids)).all() if class_ids else []
        classes_data = [
            {"id": c.id, "name": c.name, "school_id": c.school_id} for c in classes
        ]

        # Assessments for those classes
        assessments = Assessment.query.filter(Assessment.class_id.in_(class_ids)).all() if class_ids else []
        assessments_data = [
            {
                "id": a.id,
                "title": a.title,
                "type": a.type,
                "class_id": a.class_id,
                "start_time": a.start_time.isoformat() if a.start_time else None,
                "created_at": a.created_at.isoformat() if a.created_at else None
            }
            for a in assessments
        ]
        assessment_ids = [a.id for a in assessments]

        # Submissions for those assessments
        submissions = Submission.query.filter(
            Submission.assessment_id.in_(assessment_ids),
            Submission.student_id == user.id
        ).all() if assessment_ids else []
        submissions_data = [
            {
                "id": s.id,
                "assessment_id": s.assessment_id,
                "score": s.score,
                "remarks": s.remarks,
                "submitted_at": s.submitted_at.isoformat() if s.submitted_at else None
            }
            for s in submissions
        ]

        # Attendance summary (all records for this student)
        attendance_records = Attendance.query.filter_by(student_id=user.id).all()
        attendance_summary = {
            "present": 0,
            "absent": 0,
            "late": 0,
            "excused": 0,
            "total": len(attendance_records)
        }
        for record in attendance_records:
            if record.status in attendance_summary:
                attendance_summary[record.status] += 1

        # Optionally, group attendance by class
        class_attendance = {}
        for record in attendance_records:
            cid = record.class_id
            if cid not in class_attendance:
                class_attendance[cid] = {"present": 0, "absent": 0, "late": 0, "excused": 0, "total": 0}
            if record.status in class_attendance[cid]:
                class_attendance[cid][record.status] += 1
            class_attendance[cid]["total"] += 1

        return {
            "student": {
                "id": user.id,
                "full_name": user.full_name,
                "admission_number": getattr(student_profile, 'admission_number', None),
                "grade": getattr(student_profile, 'grade', None)
            },
            "school": school_data,
            "classes": classes_data,
            "assessments": assessments_data,
            "submissions": submissions_data,
            "attendance_summary": attendance_summary,
            "class_attendance": class_attendance
        }, 200



        
        
        
        