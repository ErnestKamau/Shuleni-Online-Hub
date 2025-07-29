from extensions import db
from sqlalchemy_serializer import SerializerMixin
from datetime import datetime, timezone


class Student(db.Model, SerializerMixin):
    __tablename__ = 'students'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False, unique=True)
    school_id = db.Column(db.Integer, db.ForeignKey("schools.id"), nullable=False)
    admission_number = db.Column(db.String, unique=True)
    grade = db.Column(db.String)
    class_id = db.Column(db.Integer, db.ForeignKey("classes.id"))
    created_at = db.Column(db.DateTime, default=datetime.now(timezone.utc))
    

    user = db.relationship("User", back_populates="student_profile", uselist=False)
    class_ = db.relationship("Class", back_populates="students") 
    school = db.relationship("School", back_populates="students") 


    def __repr__(self):
        return f"<Student id={self.id} user_id={self.user_id} admission_number={self.admission_number}>"
