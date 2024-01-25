from app.models.review import Review, starRating, db, environment, SCHEMA
from sqlalchemy.sql import text

def seed_reviews():
    review1 = Review(
        user_id = 1,
        food_id = 1,
        review = 'The best kutsinta!',
    )
    review2 = Review(
        user_id = 1,
        food_id = 2,
        review = 'The best pork tocino!',
    )
    review3 = Review(
        user_id = 1,
        food_id = 3,
        review = 'Very good for the price! I would recommend this chicken embutido.',
    )
    review4 = Review(
        user_id = 2,
        food_id = 1,
        review = 'This is EG testing this review!',
    )
    db.session.add(review1)
    db.session.add(review2)
    db.session.add(review3)
    db.session.add(review4)
    db.session.commit()

def undo_reviews():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.reviews RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM reviews"))

    db.session.commit()

def seed_star_ratings():
    kutsinta1 = starRating(
        food_id = 1,
        user_id = 1,
        review_id = 1,
        rating = 5
    )
    tocino1 = starRating(
        food_id = 2,
        user_id = 1,
        review_id = 2,
        rating = 4
    )
    embutido1 = starRating(
        food_id = 3,
        user_id = 1,
        review_id = 3,
        rating = 3
    )
    eg_test = starRating(
        food_id = 1,
        user_id = 2,
        review_id = 4,
        rating = 3
    )
    db.session.add(kutsinta1)
    db.session.add(tocino1)
    db.session.add(embutido1)
    db.session.add(eg_test)
    db.session.commit()

def undo_star_ratings():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.star_ratings RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM star_ratings"))

    db.session.commit()
