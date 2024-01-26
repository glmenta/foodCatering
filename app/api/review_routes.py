from flask import Blueprint, jsonify
from flask_login import login_required
from app.models.review import Review, starRating

review_routes = Blueprint('reviews', __name__)

@review_routes.route('/')
@login_required
def get_all_reviews():
    reviews = Review.query.all()
    return {'reviews': [review.to_dict() for review in reviews]}


@review_routes.route('/<int:id>')
@login_required
def get_review_by_id(id):
    review = Review.query.get(id)
    if review is None:
        return jsonify({'error': 'Review not found'}), 404
    return review.to_dict()

@review_routes.route('/<int:id>/rating')
@login_required
def get_review_stars(id):
    review = Review.query.get(id)
    if review is None:
        return jsonify({'error': 'Review not found'}), 404
    stars = starRating.query.filter(starRating.review_id == id).all()
    return {'stars': [star.to_dict() for star in stars]}

#create review
#update review
#delete review
