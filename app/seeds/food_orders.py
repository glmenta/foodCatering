from app.models.foodinfo import Food, FoodOrder, FoodMenu, db, environment, SCHEMA
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
        description="Comes in a pack of 7 pieces. Kapampangan style. The Original Tocino."
    )
    Chicken_Embutido = Food(
        id = 3,
        user_id = 3,
        name="Chicken Embutido",
        price=11.00,
        description="Comes in a pack of 3. Sausage made with chicken; Similar to meatloaf!"
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
        order_id=1,
        food_id=1,
        quantity=1
    )
    two_kutsinta = FoodOrder(
        id = 2,
        order_id=2,
        food_id=1,
        quantity=2
    )
    three_kutsinta = FoodOrder(
        id = 3,
        order_id=2,
        food_id=1,
        quantity=3
    )
    one_pork_tocino = FoodOrder(
        id = 4,
        order_id=3,
        food_id=2,
        quantity=1
    )
    one_chicken_embutido = FoodOrder(
        id = 5,
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
    monday_food_ids = [1]
    tuesday_food_ids = []
    wednesday_food_ids = [1, 2]
    thursday_food_ids = []
    friday_food_ids = [2, 3]
    saturday_food_ids = [1, 2, 3]
    sunday_food_ids = [3]

    monday_menu = FoodMenu(day_id=1)
    tuesday_menu = FoodMenu(day_id=2)
    wednesday_menu = FoodMenu(day_id=3)
    thursday_menu = FoodMenu(day_id=4)
    friday_menu = FoodMenu(day_id=5)
    saturday_menu = FoodMenu(day_id=6)
    sunday_menu = FoodMenu(day_id=7)

    monday_foods = Food.query.filter(Food.id.in_(monday_food_ids)).all()
    tuesday_foods = Food.query.filter(Food.id.in_(tuesday_food_ids)).all()
    wednesday_foods = Food.query.filter(Food.id.in_(wednesday_food_ids)).all()
    thursday_foods = Food.query.filter(Food.id.in_(thursday_food_ids)).all()
    friday_foods = Food.query.filter(Food.id.in_(friday_food_ids)).all()
    saturday_foods = Food.query.filter(Food.id.in_(saturday_food_ids)).all()
    sunday_foods = Food.query.filter(Food.id.in_(sunday_food_ids)).all()

    monday_menu.foods.extend(monday_foods)
    tuesday_menu.foods.extend(tuesday_foods)
    wednesday_menu.foods.extend(wednesday_foods)
    thursday_menu.foods.extend(thursday_foods)
    friday_menu.foods.extend(friday_foods)
    saturday_menu.foods.extend(saturday_foods)
    sunday_menu.foods.extend(sunday_foods)

    db.session.add(monday_menu)
    db.session.add(tuesday_menu)
    db.session.add(wednesday_menu)
    db.session.add(thursday_menu)
    db.session.add(friday_menu)
    db.session.add(saturday_menu)
    db.session.add(sunday_menu)

    # Commit the changes
    db.session.commit()

def undo_food_menus():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.food_menus RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM food_menus"))

    db.session.commit()
