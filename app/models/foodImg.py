from .db import db, environment, SCHEMA, add_prefix_for_prod

class FoodImage(db.Model):
    __tablename__ = 'food_images'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    url = db.Column(db.String(255), nullable=False)
    food_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('foods.id')), nullable=False)

    food = db.relationship('Food', back_populates='food_images')

    def to_dict(self):
        return {
            'id': self.id,
            'url': self.url,
            'food_id': self.food_id
        }
