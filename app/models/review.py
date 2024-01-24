from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime

class Review(db.Model):
    __tablename__ = 'reviews'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=False)
    food_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('foods.id')), nullable=False)
    rating = db.Column(db.Integer, nullable=False)
    review = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.now)
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.now)

    user = db.relationship('User', back_populates='reviews')
    food = db.relationship('Food', back_populates='reviews')

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'food_id': self.food_id,
            'rating': self.rating,
            'review': self.review,
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }

class starRating (db.Model):
    __tablename__ = 'star_ratings'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=False)
    food_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('foods.id')), nullable=False)
    review_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('reviews.id')), nullable=False)
    avg_rating = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.now)
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.now)

    user = db.relationship('User', back_populates='star_ratings')
    food = db.relationship('Food', back_populates='star_ratings')
    review = db.relationship('Review', back_populates='star_ratings')

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'food_id': self.food_id,
            'avg_rating': self.avg_rating,
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }
