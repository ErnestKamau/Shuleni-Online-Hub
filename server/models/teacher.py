from extensions import db
from datetime import datetime, timezone
from sqlalchemy_serializer import SerializerMixin


class Teacher(db.Model, SerializerMixin):
    __tablename__ = 'teachers'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False, unique=True)
    class_id = db.Column(db.Integer, db.ForeignKey("classes.id"))
    school_id = db.Column(db.Integer, db.ForeignKey('schools.id'), nullable=False)
    tsc_number = db.Column(db.String(100), unique=True)
    created_at = db.Column(db.DateTime, default=datetime.now(timezone.utc))

    
    user = db.relationship('User', backref='teacher_profile', uselist=False)

    school = db.relationship("School", back_populates="teachers")  

    def __repr__(self):
        return f"<Teacher id={self.id} name='{self.name}' user_id={self.user_id} tsc_number={self.tsc_number}>"
