from flask import Blueprint, jsonify, request
from app.models.foodinfo import Food, FoodImage
from app.models.review import Review
from app.models.user import User
from ..models.db import db
from flask_login import login_required, current_user
from ..forms.food_form import FoodForm, EditFoodForm, AddFoodImageForm
from ..forms.review_form import ReviewForm
from urllib.parse import urlsplit
from datetime import datetime
import os

food_routes = Blueprint('foods', __name__)

@food_routes.route('/')
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

    food_reviews = food.reviews
    if not food_reviews:
        return jsonify({'error': 'No reviews found'}), 404

    reviews = [review.to_dict() for review in food_reviews]

    # Calculate average rating
    total_ratings = sum(review['rating'] for review in reviews)
    average_rating = total_ratings / len(reviews) if len(reviews) > 0 else 0.0

    return {'reviews': reviews, 'average_rating': average_rating}

#get average star rating by food id
@food_routes.route('/<int:id>/ratings/average')
@login_required
def get_food_stars_avg(id):
    food = Food.query.get(id)
    if food is None:
        return jsonify({'error': 'Food not found'}), 404

    food_reviews = food.reviews
    if not food_reviews:
        return jsonify({'error': 'No reviews found'}), 404

    reviews = [review.to_dict() for review in food_reviews]

    # Calculate average rating
    total_ratings = sum(review['rating'] for review in reviews)
    average_rating = total_ratings / len(reviews) if len(reviews) > 0 else 0.0

    return {'food': food.name, 'average_rating': average_rating}
#create food
@food_routes.route('/new', methods=['POST'])
@login_required
def create_food():
    user_id = current_user.id
    check_admin = User.query.filter(User.isAdmin ==True, User.id == user_id).first()
    if not check_admin or not check_admin.isAdmin:
        return jsonify({'error': 'You must be an admin to create food'}), 401

    data = request.get_json()
    form = FoodForm(data=data)
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate():
        food = Food(
            name=data.get('name'),
            description=data.get('description'),
            price=data.get('price'),
            user_id=current_user.id
        )
        db.session.add(food)
        db.session.commit()
        img_url = form.food_img.data

        if img_url:
            url_path = urlsplit(img_url).path
            _, ext = os.path.splitext(url_path)
            if ext.lower() not in ['.jpg', '.jpeg', '.png']:
                return jsonify({'error': 'Invalid image format'}), 400
            food_image = FoodImage(
                food_id=food.id,
                url=img_url
            )
            db.session.add(food_image)
            db.session.commit()
            return {
                'message': 'Food created successfully',
                'food': food.to_dict()
            }, 201
        else:
            return {
                'message': 'Food created successfully',
                'food': food.to_dict()
            }, 201
    else:
        return jsonify(form.errors), 400


#update food
@food_routes.route('/<int:id>/edit', methods=['PUT'])
@login_required
def update_food(id):
    user_id = current_user.id
    curr_food = Food.query.get(id)
    check_admin = User.query.filter(User.isAdmin ==True, User.id == user_id).first()
    if curr_food is None:
        return jsonify({'error': 'Food not found'}), 404
    if not check_admin or not check_admin.isAdmin:
        return jsonify({'error': 'You must be an admin to create food'}), 401
    else:
        if current_user.id != curr_food.user_id:
            return jsonify({'error': 'You cannot edit another user\'s food'}), 401

    data = request.get_json()
    form = EditFoodForm(data=data)
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate():
        curr_food.name = data.get('name')
        curr_food.description = data.get('description')
        curr_food.price = data.get('price')
        db.session.commit()

        return {
            'message': 'Food updated successfully',
            'food': curr_food.to_dict()
        }, 200

    else:
        return jsonify(form.errors), 400


#delete food
@food_routes.route('/<int:id>/delete', methods=['DELETE'])
@login_required
def delete_food(id):
    food = Food.query.get(id)
    if food is None:
        return jsonify({'error': 'Food not found'}), 404
    if current_user.id != food.user_id:
        return jsonify({'error': 'You cannot delete another user\'s food'}), 401
    db.session.delete(food)
    db.session.commit()
    return {'message': 'Food deleted successfully'}, 200


#get food images by food id
@food_routes.route('/<int:id>/images')
@login_required
def get_food_images(id):
    food = Food.query.get(id)
    if food is None:
        return jsonify({'error': 'Food not found'}), 404
    food_images = food.food_images
    if food_images is None:
        return jsonify({'error': 'No images found'}), 404
    return {'images': [image.to_dict() for image in food_images]}


#add food image by food id
@food_routes.route('/<int:id>/images/new', methods=['POST'])
@login_required
def create_food_image(id):
    food = Food.query.get(id)
    if food is None:
        return jsonify({'error': 'Food not found'}), 404

    if current_user.id != food.user_id:
        return jsonify({'error': 'You cannot add images to another user\'s food'}), 401

    data = request.get_json()

    if not data:
        return jsonify({'error': 'Invalid data format. JSON expected.'}), 400

    img_url = data.get('url')
    new_food_image = FoodImage(
        food_id=food.id,
        url=img_url
    )
    db.session.add(new_food_image)
    db.session.commit()
    return jsonify({'message': 'Food image created successfully', 'image': new_food_image.to_dict()}), 201

#delete food image by food id
@food_routes.route('/<int:food_id>/images/<int:image_id>/delete', methods=['DELETE'])
@login_required
def delete_food_image(food_id, image_id):
    food = Food.query.get(food_id)
    image = FoodImage.query.get(image_id)
    user_id = current_user.id
    if food is None:
        return jsonify({'error': 'Food not found'}), 404
    if user_id != food.user_id:
        return jsonify({'error': 'You cannot delete images from another user\'s food'}), 401
    if image is None:
        return jsonify({'error': 'Image not found'}), 404
    if image.food_id != food_id:
        return jsonify({'error': 'Image does not belong to the specified food'}), 403

    db.session.delete(image)
    db.session.commit()

    return jsonify({'message': 'Image deleted successfully', 'deleted_image': image.to_dict(), 'food_images': food.to_dict()}), 200

@food_routes.route('/<int:id>/reviews/new', methods=['POST'])
@login_required
def create_review(id):
    food = Food.query.get(id)
    if food is None:
        return jsonify({'error': 'Food not found'}), 404

    data = request.get_json()

    if not data:
        return jsonify({'error': 'Invalid data format. JSON expected.'}), 400

    review_text = data.get('review')
    rating = data.get('rating')

    if not review_text or not rating:
        return jsonify({'error': 'Review and rating are required'}), 400

    try:
        rating = int(rating)
        if not (0 <= rating <= 5):
            return jsonify({'error': 'Rating must be between 0 and 5'}), 400
    except ValueError:
        return jsonify({'error': 'Invalid rating format. Must be an integer'}), 400

    new_review = Review(
        user_id=current_user.id,
        food_id=food.id,
        review=review_text,
        rating=rating,
        created_at=datetime.now(),
        updated_at=datetime.now()
    )

    db.session.add(new_review)
    db.session.commit()

    return jsonify({'message': 'Review created successfully', 'review': new_review.to_dict()}), 201

@food_routes.route('/<int:food_id>/reviews/<int:review_id>/delete', methods=['DELETE'])
@login_required
def delete_review(food_id, review_id):
    food = Food.query.get(food_id)
    review = Review.query.get(review_id)

    if review is None:
        return jsonify({'error': 'Review not found'}), 404

    if review.user_id != current_user.id:
        return jsonify({'error': 'Unauthorized to delete this review'}), 403
    if review.food_id != food_id:
        return jsonify({'error': 'Review does not belong to the specified food'}), 403

    db.session.delete(review)
    db.session.commit()

    return jsonify({'message': 'Review deleted successfully', 'deleted_review': review.to_dict(), 'food_reviews': food.to_dict()}), 200
