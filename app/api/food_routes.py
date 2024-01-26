from flask import Blueprint, jsonify
from app.models.foodinfo import Food
from flask_login import login_required

food_routes = Blueprint('foods', __name__)

@food_routes.route('/')
@login_required
def get_all_foods():
    foods = Food.query.all()
    return {'foods': [food.to_dict() for food in foods]}

@food_routes.route('/<int:id>')
@login_required
def get_food_by_id(id):
    food = Food.query.get(id)
    return food.to_dict()

#create food
#update food
#delete food
