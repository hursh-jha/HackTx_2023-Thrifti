import sqlite3

conn = sqlite3.connect('food_database.db')

cursor = conn.cursor()


def initialize_db():
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
    (10, 'Grilled Chicken Salad', 'Grilled Chicken Breast, Mixed Greens, Cherry Tomatoes, Cucumbers, Balsamic Vinaigrette', 6.00),
    (11, 'Spaghetti Bolognese', 'Spaghetti Pasta, Ground Beef, Canned Tomato Sauce, Onion, Garlic, Italian Seasoning', 5.50),
    (12, 'Baked Salmon with Steamed Vegetables', 'Salmon Fillet, Broccoli, Carrots, Lemon, Olive Oil', 8.00),
    (13, 'Vegetable and Chickpea Curry', 'Chickpeas, Mixed Vegetables, Curry Spices, Coconut Milk, Rice', 6.00),
    (14, 'Homemade Margherita Pizza', 'Pizza Dough, Tomato Sauce, Fresh Mozzarella Cheese, Fresh Basil Leaves, Olive Oil', 5.00),
    (20, 'Filet Mignon with Truffle Butter', 'Filet Mignon Steak, Truffle Butter, Fresh Herbs, Asparagus Spears, Mashed Potatoes', 25.00),
    (21, 'Lobster Bisque', 'Lobster Tails or Meat, Heavy Cream, Brandy, Lobster Stock, Butter, Chives', 20.00),
    (22, 'Seafood Paella', 'Saffron Threads, Arborio Rice, Assorted Seafood, Chorizo Sausage, Bell Peppers, Tomatoes', 22.00),
    (23, 'Beef Wellington', 'Beef Tenderloin, Puff Pastry, Foie Gras, Mushroom Duxelles, Prosciutto, Maderia Wine Sauce', 30.00),
    (24, 'Truffle Risotto', 'Arborio Rice, Truffle Oil or Shaved Truffle, Chicken Stock, Parmesan Cheese, White Wine', 20.00)
    ''')
    
initialize_db()
cursor.execute("SELECT * FROM meals")
rows = cursor.fetchall()
print(rows)

x = float(input("Input your food budget: "))

cursor.execute('''
SELECT * FROM meals
WHERE price < ?
''', (x,))

rows = cursor.fetchall()
print(rows)

conn.commit()
conn.close()