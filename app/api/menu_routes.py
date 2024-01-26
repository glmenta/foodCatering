from flask import Blueprint, jsonify
from app.models.foodinfo import FoodMenu, Food
from app.models.day import Day

menu_routes = Blueprint('menus', __name__)

#get menu by day id
@menu_routes.route('/<int:id>')
def get_menu_by_day_id(id):
    day = Day.query.get(id)
    daily_menu = FoodMenu.query.filter(FoodMenu.day_id == id).all()
    if day is None:
        return jsonify({'error': 'Day not found'}), 404
    return {'day': day.to_dict(), 'menu': [menu.to_dict() for menu in daily_menu]}


### This is similar to keebcraft;
#add food to menu by day id

#remove food from menu by day id
