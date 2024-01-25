from flask.cli import AppGroup
from .users import seed_users, undo_users
from .orders import seed_orders, undo_orders
from .food_orders import seed_foods, undo_foods, seed_food_orders, undo_food_orders, seed_food_menus, undo_food_menus
from .food_images import seed_food_images, undo_food_images
from .reviews import seed_reviews, undo_reviews, seed_star_ratings, undo_star_ratings
from .days import seed_days, undo_days
from app.models.db import db, environment, SCHEMA

# Creates a seed group to hold our commands
# So we can type `flask seed --help`
seed_commands = AppGroup('seed')


# Creates the `flask seed all` command
@seed_commands.command('all')
def seed():
    if environment == 'production':
        # Before seeding in production, you want to run the seed undo
        # command, which will  truncate all tables prefixed with
        # the schema name (see comment in users.py undo_users function).
        # Make sure to add all your other model's undo functions below
        # db.session.execute(f'TRUNCATE table {SCHEMA}.users RESTART IDENTITY CASCADE;')
        # db.session.execute(f'TRUNCATE table {SCHEMA}.orders RESTART IDENTITY CASCADE;')
        # db.session.execute(f'TRUNCATE table {SCHEMA}.food_orders RESTART IDENTITY CASCADE;')
        # db.session.execute(f'TRUNCATE table {SCHEMA}.foods RESTART IDENTITY CASCADE;')
        # db.session.execute(f'TRUNCATE table {SCHEMA}.food_images RESTART IDENTITY CASCADE;')
        # db.session.execute(f'TRUNCATE table {SCHEMA}.days RESTART IDENTITY CASCADE;')
        # db.session.execute(f'TRUNCATE table {SCHEMA}.reviews RESTART IDENTITY CASCADE;')
        # db.session.execute(f'TRUNCATE table {SCHEMA}.star_ratings RESTART IDENTITY CASCADE;')
        # db.session.execute(f'TRUNCATE table {SCHEMA}.food_menus RESTART IDENTITY CASCADE;')
        # undo_users()
        db.session.execute(f'TRUNCATE table {SCHEMA}.food_orders RESTART IDENTITY CASCADE;')
        db.session.execute(f'TRUNCATE table {SCHEMA}.food_menus RESTART IDENTITY CASCADE;')
        db.session.execute(f'TRUNCATE table {SCHEMA}.star_ratings RESTART IDENTITY CASCADE;')
        db.session.execute(f'TRUNCATE table {SCHEMA}.reviews RESTART IDENTITY CASCADE;')
        db.session.execute(f'TRUNCATE table {SCHEMA}.days RESTART IDENTITY CASCADE;')
        db.session.execute(f'TRUNCATE table {SCHEMA}.food_images RESTART IDENTITY CASCADE;')
        db.session.execute(f'TRUNCATE table {SCHEMA}.foods RESTART IDENTITY CASCADE;')
        db.session.execute(f'TRUNCATE table {SCHEMA}.orders RESTART IDENTITY CASCADE;')
        db.session.execute(f'TRUNCATE table {SCHEMA}.users RESTART IDENTITY CASCADE;')

        # Undo functions in reverse order
        undo_food_orders()
        undo_food_menus()
        undo_star_ratings()
        undo_reviews()
        undo_days()
        undo_food_images()
        undo_foods()
        undo_orders()
        undo_users()
    seed_users()
    seed_orders()
    seed_foods()
    seed_food_orders()
    seed_food_images()
    seed_days()
    seed_reviews()
    seed_star_ratings()
    seed_food_menus()
    # Add other seed functions here


# Creates the `flask seed undo` command
@seed_commands.command('undo')
def undo():
    undo_users()
    undo_orders()
    undo_foods()
    undo_food_orders()
    undo_food_images()
    undo_food_menus()
    undo_reviews()
    undo_star_ratings()
    undo_days()
    # Add other undo functions here
