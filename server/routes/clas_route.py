from flask_marshmallow import Marshmallow 
from marshmallow import auto_field 
from models.clas import Class

ma = Marshmallow()

class ClassSchema(ma.SQLAlchemySchema):
    class Meta:
        model = Class
        load_instance = True
        
