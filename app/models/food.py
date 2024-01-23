from .db import db, environment, SCHEMA, add_prefix_for_prod


class Food(db.Model):
    __tablename__ = 'foods'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    price = db.Column(db.Float, nullable=False)
    description = db.Column(db.String(255), nullable=False)
    isActive = db.Column(db.Boolean, nullable=False, default=True)

    food_orders = db.relationship('FoodOrder', back_populates='food', cascade="all, delete")
    created_at = db.Column(db.DateTime, nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'price': self.price,
            'description': self.description,
            'isActive': self.isActive
        }
