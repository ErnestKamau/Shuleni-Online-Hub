from marshmallow import Marshmallow 
from flask_marshmallow import auto_field

ma = Marshmallow()

class TeacherSchema(ma.SQLAlchemySchema):
    class Meta:
    model = Teacher
    load_instance = True

    id = auto_field()
    