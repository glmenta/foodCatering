from flask import Blueprint, jsonify, request, current_app
from app.models.foodinfo import FoodMenu, Food, food_menu_foods
from app.models.user import User
from flask_login import login_required, current_user
# from app.models.day import Day
from ..models.db import db
from ..forms.menu_form import MenuForm
from datetime import datetime

menu_routes = Blueprint('menus', __name__)

@menu_routes.route('/')
def get_all_menus():
    menus = FoodMenu.query.all()
    return {'menus': [menu.to_dict() for menu in menus]}

# #get menu by day id
# @menu_routes.route('/<int:id>')
# def get_menu_by_day_id(id):
#     day = Day.query.get(id)
#     daily_menu = FoodMenu.query.filter(FoodMenu.day_id == id).all()
#     if day is None:
#         return jsonify({'error': 'Day not found'}), 404
#     return {'day': day.to_dict(), 'menu': [menu.to_dict() for menu in daily_menu]}

# create new menu
# @menu_routes.route('/new', methods=['POST'])
# @login_required
# def create_new_menu():
#     user_id = current_user.id
#     check_admin = User.query.filter(User.isAdmin == True, User.id == user_id).first()

#     if not check_admin or not check_admin.isAdmin:
#         return jsonify({'error': 'You must be an admin to edit the menu'}), 401

#     data = request.get_json()
#     form = MenuForm(data=data)
#     form['csrf_token'].data = request.cookies['csrf_token']

#     if form.validate():
#         day_id = int(form.day.data)
#         # check if menu already exists for this day; if not, create one
#         existing_menu = FoodMenu.query.filter(FoodMenu.day_id == day_id).first()
#         if existing_menu:
#             return jsonify({'error': 'Menu already exists for this day'}), 400

#         menu = FoodMenu(day_id=day_id)
#         db.session.add(menu)
#         db.session.commit()
#         return jsonify({'message': 'Menu created successfully', 'menu': menu.to_dict()}), 201
#     else:
#         return jsonify(errors=form.errors), 400

#add food to menu by day id
# @menu_routes.route('/<int:id>/update', methods=['GET','PATCH'])
# @login_required
# def add_food_to_menu(id):
#     user_id = current_user.id
#     check_admin = User.query.filter(User.isAdmin == True, User.id == user_id).first()

#     if not check_admin or not check_admin.isAdmin:
#         return jsonify({'error': 'You must be an admin to edit the menu'}), 401

#     curr_menu = FoodMenu.query.get(id)
#     print('curr_menu', curr_menu, id)
#     if curr_menu is None:
#         return jsonify({'error': 'Menu not found'}), 404

#     if request.method == 'GET':
#         form = MenuForm()
#         return jsonify({
#             'day_choices': form.day.choices,
#             'food_choices': form.food.choices
#         })

#     data = request.get_json()
#     form = MenuForm(data=data)
#     form['csrf_token'].data = request.cookies['csrf_token']

#     if form.validate():
#         day_id = int(form.day.data)
#         food_id = int(form.food.data)

#         selected_day = Day.query.get(day_id)
#         selected_food = Food.query.get(food_id)

#         if selected_day and selected_food:
#             existing_menu = FoodMenu.query.filter_by(day=selected_day).first()

#             if existing_menu:
#                 if selected_food in existing_menu.foods:
#                     return jsonify({'error': 'Food already exists in the menu'}), 400
#                 existing_menu.foods.append(selected_food)
#                 db.session.commit()
#                 return jsonify({'message': 'Menu updated successfully', 'menu': existing_menu.to_dict()}), 200
#             else:
#                 curr_menu.day = selected_day
#                 curr_menu.foods.append(selected_food)
#                 db.session.commit()
#                 return jsonify({'message': 'Menu created and updated successfully', 'menu': curr_menu.to_dict()}), 200
#         else:
#             return jsonify({'error': 'Selected day or food not found'}), 404
#     else:
#         print(form.errors)
#         return jsonify({'error': 'Invalid form data. Check your input and try again.'}), 400

#remove food from menu by day id
@menu_routes.route('/<int:id>/delete/<int:food_id>', methods=['DELETE'])
@login_required
def remove_food_from_menu(id, food_id):
    user_id = current_user.id
    check_admin = User.query.filter(User.isAdmin == True, User.id == user_id).first()

    if not check_admin or not check_admin.isAdmin:
        return jsonify({'error': 'You must be an admin to edit the menu'}), 401

    # Check if the menu exists
    # day = Day.query.get(id)
    # print('day', day)
    curr_menu = FoodMenu.query.filter(FoodMenu).first()
    if curr_menu is None:
        return jsonify({'error': 'Menu not found'}), 404
    print('curr_menu', curr_menu)
    # Check if the selected food exists
    selected_food = Food.query.get(food_id)
    if selected_food is None:
        return jsonify({'error': 'Food not found'}), 404
    if selected_food in curr_menu.foods:
        curr_menu.foods.remove(selected_food)
        db.session.commit()
        return jsonify({'message': 'Food removed from menu successfully', 'menu': curr_menu.to_dict()}), 200
    else:
        return jsonify({'error': 'Food not found in menu'}), 404




@menu_routes.route('/set_current_menu/<int:id>', methods=['PATCH'])
@login_required
def set_current_menu(id):
    # day = Day.query.get(id)
    user = current_user
    if user.isAdmin == False:
        return jsonify({'error': 'You must be an admin to edit the menu'}), 401
    # if day is None:
    #     return jsonify({'error': 'Day not found'}), 404

    current_menu = FoodMenu.query.filter_by().first()

    if current_menu:
        current_app.config['CURRENT_MENU_ID'] = current_menu.id
    else:
        return jsonify({'error': 'Current menu not found'}), 404
        # current_menu = FoodMenu(day_id=id, current_menu_id=id)
        # current_app.config['CURRENT_MENU_ID'] = current_menu.id

    db.session.commit()
    updated_menu = FoodMenu.query.get(current_menu.id)

    if updated_menu:
        return jsonify({'message': 'Current menu updated successfully', 'updated_menu': updated_menu.to_dict()}), 200
    else:
        return jsonify({'error': 'Failed to fetch updated menu'}), 500



@menu_routes.route('/current', methods=['GET'])
def get_current_menu():
    current_menu_id = current_app.config.get('CURRENT_MENU_ID')

    if current_menu_id is None:
        return jsonify({'error': 'Current menu not set'}), 404

    current_menu_record = FoodMenu.query.get(current_menu_id)

    if current_menu_record is None:
        return jsonify({'error': 'Current menu not found'}), 404

    current_menu = current_menu_record.to_dict()

    return jsonify({'current_menu': current_menu}), 200
