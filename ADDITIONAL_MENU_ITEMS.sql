-- Additional AI-Generated Menu Items for Glimpse Restaurant Kigali
-- Run this in MySQL Workbench after running DATABASE_SCHEMA.sql

USE glimpse_restaurant_kigali;

-- More Breakfast Items
INSERT INTO menu_items (name, description, price, category_id, image_url) VALUES
('Smoked Salmon Bagel', 'Toasted bagel with cream cheese, smoked salmon, capers, and red onion', 11500, 1, 'https://images.unsplash.com/photo-1619096252214-ef06c45683e3?auto=format&fit=crop&w=900&q=80'),
('Acai Bowl', 'Acai berry smoothie bowl topped with granola, fresh fruits, and honey', 9000, 1, 'https://images.unsplash.com/photo-1590301157890-4810ed352733?auto=format&fit=crop&w=900&q=80'),
('Breakfast Burrito', 'Scrambled eggs, bacon, cheese, avocado, and salsa wrapped in tortilla', 10500, 1, 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=900&q=80'),
('Belgian Waffles', 'Crispy waffles with whipped cream, strawberries, and maple syrup', 8500, 1, 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?auto=format&fit=crop&w=900&q=80');

-- More Lunch Items
INSERT INTO menu_items (name, description, price, category_id, image_url) VALUES
('Margherita Pizza', 'Classic pizza with fresh mozzarella, tomatoes, and basil', 14000, 2, 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=900&q=80'),
('Chicken Caesar Wrap', 'Grilled chicken, romaine, parmesan, and Caesar dressing in wrap', 12000, 2, 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=900&q=80'),
('Shrimp Scampi Pasta', 'Linguine with garlic butter shrimp, white wine, and parsley', 17500, 2, 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=900&q=80'),
('Mediterranean Platter', 'Hummus, falafel, tabbouleh, pita bread, and tzatziki sauce', 13500, 2, 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?auto=format&fit=crop&w=900&q=80'),
('Pulled Pork Sandwich', 'Slow-cooked pulled pork with BBQ sauce and coleslaw on brioche', 15500, 2, 'https://images.unsplash.com/photo-1619740455993-9e4e0b27e7f7?auto=format&fit=crop&w=900&q=80');

-- More Dinner Items
INSERT INTO menu_items (name, description, price, category_id, image_url) VALUES
('Filet Mignon', 'Premium beef tenderloin with red wine reduction and truffle mash', 42000, 3, 'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=900&q=80'),
('Chilean Sea Bass', 'Pan-seared sea bass with lemon caper sauce and roasted vegetables', 38000, 3, 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=900&q=80'),
('Rack of Lamb', 'Herb-crusted lamb rack with rosemary jus and garlic potatoes', 45000, 3, 'https://images.unsplash.com/photo-1595777216528-071e0127ccf4?auto=format&fit=crop&w=900&q=80'),
('Surf and Turf', 'Grilled steak and lobster tail with drawn butter', 52000, 3, 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=80'),
('Mushroom Ravioli', 'Handmade ravioli stuffed with wild mushrooms in cream sauce', 22000, 3, 'https://images.unsplash.com/photo-1587740908075-9e245070dfaa?auto=format&fit=crop&w=900&q=80'),
('Grilled Octopus', 'Tender octopus with olive oil, lemon, and Mediterranean herbs', 28000, 3, 'https://images.unsplash.com/photo-1599084993091-1cb5c0721cc6?auto=format&fit=crop&w=900&q=80');

-- More Drinks
INSERT INTO menu_items (name, description, price, category_id, image_url) VALUES
('Pineapple Juice', 'Freshly squeezed tropical pineapple juice', 3800, 4, 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=900&q=80'),
('Strawberry Smoothie', 'Creamy strawberry smoothie with banana and yogurt', 4800, 4, 'https://images.unsplash.com/photo-1505252585461-04db1eb84625?auto=format&fit=crop&w=900&q=80'),
('Americano', 'Double shot espresso with hot water', 3000, 4, 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=900&q=80'),
('Macchiato', 'Espresso with a dollop of foamed milk', 3200, 4, 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?auto=format&fit=crop&w=900&q=80'),
('Margarita', 'Classic tequila cocktail with lime and salt rim', 8000, 4, 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?auto=format&fit=crop&w=900&q=80'),
('Piña Colada', 'Tropical blend of rum, coconut cream, and pineapple', 8500, 4, 'https://images.unsplash.com/photo-1546171753-97d7676e4602?auto=format&fit=crop&w=900&q=80'),
('Champagne Glass', 'Premium French champagne', 12000, 4, 'https://images.unsplash.com/photo-1547595628-c61a29f496f0?auto=format&fit=crop&w=900&q=80'),
('Whiskey Sour', 'Bourbon with lemon juice and simple syrup', 9000, 4, 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=900&q=80'),
('Fresh Lemonade', 'Homemade lemonade with mint', 3000, 4, 'https://images.unsplash.com/photo-1523677011781-c91d1bbe2f9d?auto=format&fit=crop&w=900&q=80'),
('Iced Coffee', 'Cold brew coffee with ice and milk', 3800, 4, 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?auto=format&fit=crop&w=900&q=80');

-- More Desserts
INSERT INTO menu_items (name, description, price, category_id, image_url) VALUES
('Lemon Tart', 'Tangy lemon custard in buttery pastry shell', 7200, 5, 'https://images.unsplash.com/photo-1519915028121-7d3463d20b13?auto=format&fit=crop&w=900&q=80'),
('Brownie Sundae', 'Warm chocolate brownie with vanilla ice cream and hot fudge', 8200, 5, 'https://images.unsplash.com/photo-1607920591413-4ec007e70023?auto=format&fit=crop&w=900&q=80'),
('Fruit Tart', 'Vanilla custard tart topped with fresh seasonal fruits', 7800, 5, 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=900&q=80'),
('Macarons Assortment', 'Six French macarons in assorted flavors', 6800, 5, 'https://images.unsplash.com/photo-1569864358642-9d1684040f43?auto=format&fit=crop&w=900&q=80'),
('Banoffee Pie', 'Banana and toffee pie with whipped cream', 7500, 5, 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?auto=format&fit=crop&w=900&q=80'),
('Affogato', 'Vanilla gelato drowned in hot espresso', 6200, 5, 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=900&q=80');
