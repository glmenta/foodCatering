from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField
from wtforms.validators import DataRequired
from app.models.foodinfo import Food, FoodMenu, FoodOrder
from app.models.day import Day

class MenuForm(FlaskForm):
    # add food to menu depending on the day
    day = StringField('day', validators=[DataRequired()])
    food = StringField('food', validators=[DataRequired()])
    submit = SubmitField('Submit')

    def __init__(self, *args, **kwargs):
        super(MenuForm, self).__init__(*args, **kwargs)
        self.add_food_to_day()

    def add_food_to_day(self):
        self.day.choices = [(day.id, day.day) for day in Day.query.all()]
        self.food.choices = [(food.id, food.name) for food in Food.query.all()]
