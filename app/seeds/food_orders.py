from app.models.foodinfo import Food, FoodOrder, FoodMenu, db, environment, SCHEMA, food_menu_foods
from sqlalchemy.sql import text

def seed_foods():
    Kutsinta = Food(
        id = 1,
        user_id = 3,
        name="Kutsinta",
        price=9.00,
        description="Comes in a pack of 7 pieces. It is made from a mixture of tapioca or rice flour, brown sugar and lye, enhanced with yellow food coloring or annatto extract.",
        isActive=True
    )
    Pork_Tocino = Food(
        id = 2,
        user_id = 3,
        name="Pork Tocino",
        price=13.00,
        description="Comes in a pack of 7 pieces. Kapampangan style. The Original Tocino.",
        isActive=True
    )
    Chicken_Embutido = Food(
        id = 3,
        user_id = 3,
        name="Chicken Embutido",
        price=11.00,
        description="Comes in a pack of 3. Sausage made with chicken; Similar to meatloaf!",
        isActive=True
    )
    db.session.add(Kutsinta)
    db.session.add(Pork_Tocino)
    db.session.add(Chicken_Embutido)
    db.session.commit()

def undo_foods():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.foods RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM foods"))

    db.session.commit()

def seed_food_orders():
    one_kutsinta = FoodOrder(
        id = 1,
        user_id=1,
        order_id=1,
        food_id=1,
        quantity=1
    )
    two_kutsinta = FoodOrder(
        id = 2,
        user_id=1,
        order_id=2,
        food_id=1,
        quantity=2
    )
    three_kutsinta = FoodOrder(
        id = 3,
        user_id=1,
        order_id=2,
        food_id=1,
        quantity=3
    )
    one_pork_tocino = FoodOrder(
        id = 4,
        user_id=2,
        order_id=3,
        food_id=2,
        quantity=1
    )
    one_chicken_embutido = FoodOrder(
        id = 5,
        user_id=2,
        order_id=3,
        food_id=3,
        quantity=1
    )
    db.session.add(one_kutsinta)
    db.session.add(two_kutsinta)
    db.session.add(three_kutsinta)
    db.session.add(one_pork_tocino)
    db.session.add(one_chicken_embutido)
    db.session.commit()

def undo_food_orders():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.food_orders RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM food_orders"))

    db.session.commit()

def seed_food_menus():
    pass

def undo_food_menus():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.food_menus RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM food_menus"))

    db.session.commit()
