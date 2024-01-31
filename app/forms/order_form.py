from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField, SelectField
from wtforms.validators import DataRequired, ValidationError
from app.models.order import Order
from app.models.day import Day
from app.models.foodinfo import FoodOrder, Food, FoodMenu

# order form needs: order name, choice of food in order and quantity, submit
class FoodOrderForm(FlaskForm):
    food = SelectField('food', validators=[DataRequired()])
    quantity = StringField('quantity', validators=[DataRequired()])
    submit = SubmitField('Submit')

    def __init__(self, *args, **kwargs):
        super(FoodOrderForm, self).__init__(*args, **kwargs)
        self.add_food_to_order()

    def add_food_to_order(self):
        self.food.choices = [(str(food.id), food.name) for food in Food.query.all()]
        print(self.food.choices)

class OrderForm(FlaskForm):
    order_name = StringField('order_name', validators=[DataRequired()])
    submit = SubmitField('Submit')
