from flask import Blueprint, jsonify, request
from app.models.foodinfo import FoodOrder
from ..models.db import db

food_order_routes = Blueprint('food_orders', __name__)

@food_order_routes.route('/')
def get_food_orders():
    food_orders = FoodOrder.query.all()
    return {'food_orders': [foodorder.to_dict() for foodorder in food_orders]}


@food_order_routes.route('/<int:id>')
def get_food_order(id):
    food_order = FoodOrder.query.get(id)

    if food_order is None:
        return jsonify({'error': 'Food order not found'}), 404

    return {'food_order': food_order.to_dict()}
