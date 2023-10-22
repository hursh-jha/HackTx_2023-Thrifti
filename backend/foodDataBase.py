import sqlite3

conn = sqlite3.connect('food_database.db')

cursor = conn.cursor()


def initialize_db():
    cursor.execute("DROP TABLE IF EXISTS meals")
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS meals (
            id INTEGER PRIMARY KEY,
            mealName TEXT,
            ingredients TEXT,
            price REAL
        )
    ''')

    cursor.execute('''
    INSERT INTO meals VALUES
    (00, 'Spaghetti Aglio e Olio', 'Spaghetti, Olive Oil, Garlic, Red pepper flakes, Parmesan cheese', 2.50),
    (01, 'Rice and Beans', 'Rice, Canned Beans, Onion, Garlic, Spices', 2.00),
    (02, 'Vegetable Stir-Fry with Rice', 'Rice, Mixed Vegetables, Soy Sauce, Garlic, Ginger, Vegetable Oil', 3.00),
    (03, 'Omelette with Toast', 'Eggs, Milk, Butter, Salt and Pepper, Bread', 2.00),
    (04, 'Grilled Cheese Sandwich with Tomato Soup', 'Bread, Cheese slices, Butter, Canned Tomato Soup', 3.00),
    (05, 'Flatbread', 'Bread, Marinara, Mozerella, Parmesean, OlivE Oil, Basil', 5.25),
    (06, 'Fried Chicken', 'Chicken Breasts, Panko, Eggs, Flour, Buffalo Sauce, Ranch', 8.00),
    (07, 'Chicken Parmesean', 'Chicken Breasts, Marinara, Mozerella, Parmesean, Spaghetti', 10.00),
    (08, 'Chicken Alfredo', 'Chicken Breasts, Alfredo Sauce, Spaghetti', 10.00),
    (09, 'Pad Thai', 'Noodles, Eggs, Tofu, Peanut Butter, Soy Sauce, Onion, Garlic, Spices', 4.50),
    (10, 'Grilled Chicken Salad', 'Grilled Chicken Breast, Mixed Greens, Cherry Tomatoes, Cucumbers, Balsamic Vinaigrette', 6.00),
    (11, 'Spaghetti Bolognese', 'Spaghetti Pasta, Ground Beef, Canned Tomato Sauce, Onion, Garlic, Italian Seasoning', 5.50),
    (12, 'Baked Salmon with Steamed Vegetables', 'Salmon Fillet, Broccoli, Carrots, Lemon, Olive Oil', 8.00),
    (13, 'Vegetable and Chickpea Curry', 'Chickpeas, Mixed Vegetables, Curry Spices, Coconut Milk, Rice', 6.00),
    (14, 'Homemade Margherita Pizza', 'Pizza Dough, Tomato Sauce, Fresh Mozzarella Cheese, Fresh Basil Leaves, Olive Oil', 5.00),
    (15, 'Chicken Tikka Masala', 'Chicken Breasts, Tomato Sauce, Coconut Milk, Curry Spices, Rice', 7.00),
    (16, 'Beef Stew', 'Beef Stew Meat, Carrots, Potatoes, Onion, Garlic, Beef Broth, Red Wine', 8.00),
    (17, 'Beef Stroganoff', 'Beef Stew Meat, Mushrooms, Onion, Garlic, Sour Cream, Beef Broth, Egg Noodles', 8.00),
    (18, 'Chicken Marsala', 'Chicken Breasts, Mushrooms, Marsala Wine, Chicken Broth, Butter, Flour, Egg Noodles', 8.00),
    (19, 'Chicken Cordon Bleu', 'Chicken Breasts, Ham, Swiss Cheese, Flour, Eggs, Bread Crumbs, Butter, Egg Noodles', 8.00),
    (20, 'Filet Mignon with Truffle Butter', 'Filet Mignon Steak, Truffle Butter, Fresh Herbs, Asparagus Spears, Mashed Potatoes', 25.00),
    (21, 'Lobster Bisque', 'Lobster Tails or Meat, Heavy Cream, Brandy, Lobster Stock, Butter, Chives', 20.00),
    (22, 'Seafood Paella', 'Saffron Threads, Arborio Rice, Assorted Seafood, Chorizo Sausage, Bell Peppers, Tomatoes', 22.00),
    (23, 'Beef Wellington', 'Beef Tenderloin, Puff Pastry, Foie Gras, Mushroom Duxelles, Prosciutto, Maderia Wine Sauce', 30.00),
    (24, 'Truffle Risotto', 'Arborio Rice, Truffle Oil or Shaved Truffle, Chicken Stock, Parmesan Cheese, White Wine', 20.00),
    (25, 'Creme Brulee', 'Heavy Cream, Vanilla Bean, Egg Yolks, Sugar', 5.00),
    (26, 'Chocolate Souffle', 'Eggs, Chocolate, Butter, Sugar, Flour', 5.00),
    (27, 'Hamburger', 'Ground Beef, Hamburger Buns, Lettuce, Tomato, Onion, Ketchup, Mustard, Mayonnaise', 3.00),
    (28, 'Cheeseburger', 'Ground Beef, Hamburger Buns, Lettuce, Tomato, Onion, Cheddar Cheese, Ketchup, Mustard, Mayonnaise', 3.50),
    (29, 'Velvita Mac and Cheese', 'Elbow Macaroni, Velvita Cheese, Milk, Butter', 2.00)
    ''')

initialize_db()
# cursor.execute("SELECT * FROM meals")
# rows = cursor.fetchall()
# print(rows)

# x = float(input("Input your food budget: "))

# cursor.execute('''
# SELECT * FROM meals
# WHERE price < ?
# ''', (x,))

# rows = cursor.fetchall()
# print(rows)

conn.commit()
conn.close()