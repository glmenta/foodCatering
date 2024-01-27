from flask import Blueprint, jsonify, request
from app.models.foodinfo import FoodMenu, Food
from app.models.user import User
from flask_login import login_required, current_user
from app.models.day import Day
from ..forms.menu_form import MenuForm

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
@menu_routes.route('/<int:id>/edit', methods=['GET','PUT'])
@login_required
def add_food_to_menu(id):
    if request.method == 'GET':
        menu = FoodMenu.query.get(id)
        if menu is None:
            return jsonify({'error': 'Menu not found'}), 404
        return jsonify({'menu': menu.to_dict()})

    user_id = current_user.id
    check_admin = User.query.filter(User.isAdmin ==True, User.id == user_id).first()
    if not check_admin or not check_admin.isAdmin:
        return jsonify({'error': 'You must be an admin to edit the menu'}), 401

    curr_menu = FoodMenu.query.get(id)
    if curr_menu is None:
        return jsonify({'error': 'Menu not found'}), 404

    if request.method == 'PUT':
        data = request.get_json()
        form = MenuForm(data=data)
        form['csrf_token'].data = request.cookies['csrf_token']

        if form.validate():
            pass


#remove food from menu by day id
