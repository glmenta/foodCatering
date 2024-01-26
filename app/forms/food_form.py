from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField
from wtforms.validators import DataRequired
from app.models.foodinfo import Food

class FoodForm(FlaskForm):
    name = StringField('name', validators=[DataRequired()])
    description = StringField('description', validators=[DataRequired()])
    price = StringField('price', validators=[DataRequired()])
    food_img = StringField('food_img')
    submit = SubmitField('Submit')


class EditFoodForm(FlaskForm):
    name = StringField('name', validators=[DataRequired()])
    description = StringField('description', validators=[DataRequired()])
    price = StringField('price', validators=[DataRequired()])
    submit = SubmitField('Submit')
