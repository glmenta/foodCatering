from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField, SelectField, BooleanField
from wtforms.validators import DataRequired
from app.models.foodinfo import Food, FoodMenu, FoodOrder
# from app.models.day import Day
from flask import current_app

class MenuForm(FlaskForm):
    # Add food to the menu depending on the day
    name = StringField('name', validators=[DataRequired()])
    food = SelectField('food', validators=[DataRequired()])
    isActive = BooleanField('isActive')
    submit = SubmitField('Submit')

    def __init__(self, *args, **kwargs):
        super(MenuForm, self).__init__(*args, **kwargs)
        self.add_food_to_day()

    def add_food_to_day(self):
        foods = Food.query.all()
        self.food.choices = [(str(food.id), food.name) for food in foods]
        print('Choices:', self.food.choices)

class UpdateFoodMenuForm(FlaskForm):
    food = SelectField('food', validators=[DataRequired()])
    isActive = BooleanField('isActive')
    submit = SubmitField('Submit')

    def __init__(self, *args, **kwargs):
        super(UpdateFoodMenuForm, self).__init__(*args, **kwargs)
        self.add_food_to_day()

    def add_food_to_day(self):
        foods = Food.query.all()
        self.food.choices = [(str(food.id), food.name) for food in foods]
