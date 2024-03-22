from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField, SelectField
from wtforms.validators import DataRequired
from app.models.foodinfo import Food, FoodMenu, FoodOrder
# from app.models.day import Day
from flask import current_app

class MenuForm(FlaskForm):
    # Add food to the menu depending on the day
    day = SelectField('day', validators=[DataRequired()])
    food = SelectField('food', validators=[DataRequired()])
    submit = SubmitField('Submit')

    def __init__(self, *args, **kwargs):
        super(MenuForm, self).__init__(*args, **kwargs)
        self.add_food_to_day()

    def add_food_to_day(self):
        # days = Day.query.all()
        # foods = Food.query.all()

        # self.day.choices = [(str(day.id), day.day) for day in days]
        # self.food.choices = [(str(food.id), food.name) for food in foods]
        pass

class AddFoodToMenuForm(FlaskForm):
    pass
