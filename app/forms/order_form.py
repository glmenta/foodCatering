from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField, SelectField, IntegerField
from wtforms.validators import DataRequired, ValidationError
from app.models.order import Order
from app.models.day import Day
from app.models.foodinfo import FoodOrder, Food, FoodMenu

# order form needs: order name, choice of food in order and quantity, submit
class FoodOrderForm(FlaskForm):
    food = SelectField('Food', validators=[DataRequired()], coerce=int)
    quantity = IntegerField('Quantity', validators=[DataRequired()])
    submit = SubmitField('Submit')

    def __init__(self, *args, **kwargs):
        super(FoodOrderForm, self).__init__(*args, **kwargs)
        self.add_food_to_order()

    def add_food_to_order(self):
        # Assuming Food has an 'id' and 'name' attribute
        self.food.choices = [(food.id, food.name) for food in Food.query.all()]
        print('These are the choices:', self.food.choices)

class OrderForm(FlaskForm):
    order_name = StringField('order_name', validators=[DataRequired()])
    submit = SubmitField('Submit')
