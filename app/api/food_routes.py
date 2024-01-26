from flask import Blueprint, jsonify, request
from app.models.foodinfo import Food
from app.models.review import starRating, Review
from ..models.db import db
from flask_login import login_required, current_user

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
    if food is None:
        return jsonify({'error': 'Food not found'}), 404
    return food.to_dict()

#get food reviews by food id
@food_routes.route('/<int:id>/reviews')
@login_required
def get_food_reviews(id):
    food = Food.query.get(id)
    if food is None:
        return jsonify({'error': 'Food not found'}), 404
    food_reviews = food.reviews
    if food_reviews is None:
        return jsonify({'error': 'No reviews found'}), 404
    return {'reviews': [review.to_dict() for review in food_reviews]}

#get star rating by food id
@food_routes.route('/<int:id>/ratings')
@login_required
def get_food_stars(id):
    food = Food.query.get(id)
    if food is None:
        return jsonify({'error': 'Food not found'}), 404
    stars = starRating.query.filter(starRating.food_id == id).all()
    return {'stars': [star.to_dict() for star in stars]}

#get average star rating by food id
@food_routes.route('/<int:id>/ratings/average')
@login_required
def get_food_stars_avg(id):
    food = Food.query.get(id)
    if food is None:
        return jsonify({'error': 'Food not found'}), 404
    stars = starRating.query.filter(starRating.food_id == id).all()
    if len(stars) == 0:
        return jsonify({'error': 'No reviews found'}), 404
    total = 0
    for star in stars:
        total += star.rating
    return {'average': total / len(stars)}

#create food
@food_routes.route('/new', methods=['POST'])
@login_required
def create_food():
    pass

#update food
@food_routes.route('/<int:id>/edit', methods=['PUT'])
@login_required
def update_food(id):
    pass

#delete food
@food_routes.route('/<int:id>/delete', methods=['DELETE'])
@login_required
def delete_food(id):
    pass

#create food review by food id
@food_routes.route('/<int:id>/reviews/new', methods=['POST'])
@login_required
def create_food_review(id):
    data = request.get_json()
    food = Food.query.get(id)
    if food is None:
        return jsonify({'error': 'Food not found'}), 404
    if current_user.id == food.user_id:
        return jsonify({'error': 'You cannot review your own food'}), 400
    review = Review(
        user_id=current_user.id,
        food_id=id,
        review=data.get('review')
    )
    db.session.add(review)
    db.session.commit()
    return {
            'message': 'Food review created successfully',
            'review': review.to_dict()
        }, 201
