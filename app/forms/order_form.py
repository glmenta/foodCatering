from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField, SelectField, IntegerField
from wtforms.validators import DataRequired, ValidationError, NumberRange
from app.models.order import Order
# from app.models.day import Day
from app.models.foodinfo import FoodOrder, Food, FoodMenu, food_menu_foods

# order form needs: order name, choice of food in order and quantity, submit
class FoodOrderForm(FlaskForm):
    food = SelectField('Food', validators=[DataRequired()], coerce=int)
    quantity = IntegerField('Quantity', validators=[DataRequired()])
    submit = SubmitField('Submit')

    def __init__(self, food_menu_id, *args, **kwargs):
        super(FoodOrderForm, self).__init__(*args, **kwargs)
        self.add_food_to_order(food_menu_id)

    def add_food_to_order(self, food_menu_id):
        print('Food menu ID:', food_menu_id)
        food_menu_instance = FoodMenu.query.get(food_menu_id)
        if food_menu_instance is None:
            print(f"Food menu with ID {food_menu_id} not found")
        print('Food menu instance:', food_menu_instance)
        associated_foods = getattr(food_menu_instance, 'foods', [])
        print('Associated foods:', associated_foods)
        self.food.choices = [(food.id, food.name) for food in associated_foods]

class AddFoodOrderToOrder(FlaskForm):
    # Use SelectField for the dropdown of available foods
    available_foods = SelectField('Available Foods', coerce=int, validators=[DataRequired()])

    # IntegerField for the quantity of the selected food
    quantity = IntegerField('Quantity', validators=[DataRequired(), NumberRange(min=1)])

    # SubmitField for submitting the form
    submit = SubmitField('Add to Order')


class OrderForm(FlaskForm):
    order_name = StringField('order_name', validators=[DataRequired()])
    submit = SubmitField('Submit')
