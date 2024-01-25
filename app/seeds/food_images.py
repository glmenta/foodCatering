from app.models.foodinfo import db, FoodImage, environment, SCHEMA
from sqlalchemy.sql import text

def seed_food_images():
    kutsinta_img = FoodImage(
        id = 1,
        food_id = 1,
        url = "https://scontent-sjc3-1.xx.fbcdn.net/v/t1.15752-9/411482395_744606497241586_3962880085322548091_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=8cd0a2&_nc_ohc=udtavKu-3vMAX8YGNnZ&_nc_ht=scontent-sjc3-1.xx&oh=03_AdRzEww9Wmc46HxCKob9oKXuKLuZK8-qx_zsWhYCgKDkhg&oe=65D8FE43"
    )
    pork_tocino_img = FoodImage(
        id = 2,
        food_id = 2,
        url = "https://scontent-sjc3-1.xx.fbcdn.net/v/t1.15752-9/411479361_701139872145612_2241443012570876065_n.jpg?stp=dst-jpg_p1080x2048&_nc_cat=100&ccb=1-7&_nc_sid=8cd0a2&_nc_ohc=noV7p3O12-gAX_PRk3d&_nc_ht=scontent-sjc3-1.xx&oh=03_AdQWy75QTNsYUqmK9TlYrUTxDVOz3fA4nBbdOBNiSj8dJA&oe=65D8F449"
    )
    chicken_embutido_img = FoodImage(
        id = 3,
        food_id = 3,
        url = "https://scontent-sjc3-1.xx.fbcdn.net/v/t1.15752-9/411467261_260335230249251_3785045188674510840_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=8cd0a2&_nc_ohc=C3e2hFOxmIUAX8pttya&_nc_ht=scontent-sjc3-1.xx&oh=03_AdTv3pWVpv1kU9DF6kQV7rmwP9SWZLjKrVT8O0Dyw_M-Uw&oe=65D9059D"
    )
    db.session.add(kutsinta_img)
    db.session.add(pork_tocino_img)
    db.session.add(chicken_embutido_img)
    db.session.commit()

def undo_food_images():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.food_images RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM food_images"))

    db.session.commit()
