-- ============================================
-- GLIMPSE RESTAURANT - Database Schema
-- Modern Luxury Menu System
-- ============================================

-- Create Database
DROP DATABASE IF EXISTS glimpse_restaurant;
CREATE DATABASE glimpse_restaurant CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE glimpse_restaurant;

-- ============================================
-- Table: categories
-- ============================================
CREATE TABLE categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- Table: menu_items
-- ============================================
CREATE TABLE menu_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image VARCHAR(255),
  category_id INT NOT NULL,
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
  INDEX idx_category (category_id),
  INDEX idx_available (is_available)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- Insert Categories
-- ============================================
INSERT INTO categories (name) VALUES
('Breakfast'),
('Lunch'),
('Dinner'),
('Drinks'),
('Desserts');

-- ============================================
-- Insert Menu Items - BREAKFAST
-- ============================================
INSERT INTO menu_items (name, description, price, image, category_id) VALUES
('Eggs Benedict Royale', 'Poached eggs on English muffin with smoked salmon, hollandaise sauce, and fresh herbs', 12500, 'breakfast-1.jpg', 1),
('French Toast Deluxe', 'Brioche bread soaked in vanilla custard, topped with fresh berries, whipped cream, and maple syrup', 9500, 'breakfast-2.jpg', 1),
('Avocado Toast Supreme', 'Smashed avocado on sourdough with poached eggs, cherry tomatoes, feta cheese, and microgreens', 11000, 'breakfast-3.jpg', 1),
('Pancake Stack', 'Fluffy buttermilk pancakes with whipped butter, fresh strawberries, and honey drizzle', 8500, 'breakfast-4.jpg', 1),
('Continental Breakfast', 'Assorted croissants, fresh fruit platter, yogurt parfait, granola, and orange juice', 15000, 'breakfast-5.jpg', 1),
('Omelette Deluxe', 'Three-egg omelette with mushrooms, cheese, spinach, bell peppers, and herbs', 10500, 'breakfast-6.jpg', 1),
('Smoked Salmon Bagel', 'Toasted bagel with cream cheese, smoked salmon, capers, red onion, and dill', 13500, 'breakfast-7.jpg', 1),
('Acai Bowl', 'Acai berry smoothie bowl topped with granola, fresh fruits, coconut flakes, and honey', 11500, 'breakfast-8.jpg', 1);

-- ============================================
-- Insert Menu Items - LUNCH
-- ============================================
INSERT INTO menu_items (name, description, price, image, category_id) VALUES
('Caesar Salad Premium', 'Crisp romaine lettuce with grilled chicken, parmesan, croutons, and classic Caesar dressing', 14000, 'lunch-1.jpg', 2),
('Grilled Chicken Sandwich', 'Marinated chicken breast with lettuce, tomato, avocado, and chipotle aioli on ciabatta', 16500, 'lunch-2.jpg', 2),
('Beef Burger Deluxe', 'Angus beef patty with cheddar, bacon, caramelized onions, lettuce, tomato, and truffle fries', 19000, 'lunch-3.jpg', 2),
('Pasta Carbonara', 'Creamy pasta with pancetta, parmesan, black pepper, and egg yolk', 17500, 'lunch-4.jpg', 2),
('Fish Tacos', 'Grilled tilapia with cabbage slaw, avocado, pico de gallo, and chipotle mayo', 18000, 'lunch-5.jpg', 2),
('Quinoa Buddha Bowl', 'Roasted vegetables, chickpeas, quinoa, avocado, and tahini dressing', 15500, 'lunch-6.jpg', 2),
('Club Sandwich', 'Triple-decker with turkey, bacon, lettuce, tomato, mayo, and sweet potato fries', 16000, 'lunch-7.jpg', 2),
('Margherita Pizza', 'Classic pizza with fresh mozzarella, tomatoes, basil, and olive oil', 17000, 'lunch-8.jpg', 2),
('Shrimp Scampi Pasta', 'Linguine with garlic butter shrimp, white wine, lemon, and parsley', 21000, 'lunch-9.jpg', 2),
('Mediterranean Platter', 'Hummus, falafel, tabbouleh, pita bread, olives, and tzatziki sauce', 16500, 'lunch-10.jpg', 2);

-- ============================================
-- Insert Menu Items - DINNER
-- ============================================
INSERT INTO menu_items (name, description, price, image, category_id) VALUES
('Grilled Ribeye Steak', 'Premium 350g ribeye with herb butter, roasted potatoes, and seasonal vegetables', 35000, 'dinner-1.jpg', 3),
('Pan-Seared Salmon', 'Atlantic salmon with lemon butter sauce, asparagus, and wild rice', 28000, 'dinner-2.jpg', 3),
('Lamb Chops', 'Herb-crusted lamb chops with mint jelly, mashed potatoes, and green beans', 38000, 'dinner-3.jpg', 3),
('Lobster Thermidor', 'Whole lobster in creamy cognac sauce with gruyere cheese and vegetables', 55000, 'dinner-4.jpg', 3),
('Beef Wellington', 'Tender beef fillet wrapped in puff pastry with mushroom duxelles and red wine jus', 45000, 'dinner-5.jpg', 3),
('Seafood Paella', 'Spanish rice with prawns, mussels, calamari, saffron, and vegetables', 32000, 'dinner-6.jpg', 3),
('Duck Confit', 'Slow-cooked duck leg with orange glaze and roasted root vegetables', 34000, 'dinner-7.jpg', 3),
('Vegetarian Risotto', 'Creamy arborio rice with wild mushrooms, truffle oil, and parmesan', 22000, 'dinner-8.jpg', 3),
('Filet Mignon', 'Premium beef tenderloin with red wine reduction and truffle mashed potatoes', 48000, 'dinner-9.jpg', 3),
('Chilean Sea Bass', 'Pan-seared sea bass with lemon caper sauce and roasted vegetables', 42000, 'dinner-10.jpg', 3),
('Rack of Lamb', 'Herb-crusted lamb rack with rosemary jus and garlic potatoes', 52000, 'dinner-11.jpg', 3),
('Surf and Turf', 'Grilled steak and lobster tail with drawn butter and vegetables', 65000, 'dinner-12.jpg', 3);

-- ============================================
-- Insert Menu Items - DRINKS
-- ============================================
INSERT INTO menu_items (name, description, price, image, category_id) VALUES
('Fresh Orange Juice', 'Freshly squeezed orange juice', 4500, 'drinks-1.jpg', 4),
('Mango Smoothie', 'Tropical mango smoothie with yogurt and honey', 5500, 'drinks-2.jpg', 4),
('Espresso', 'Rich Italian espresso', 3000, 'drinks-3.jpg', 4),
('Cappuccino', 'Classic cappuccino with steamed milk foam', 4000, 'drinks-4.jpg', 4),
('Iced Latte', 'Cold espresso with milk and ice', 4500, 'drinks-5.jpg', 4),
('Mojito', 'Classic mojito with fresh mint, lime, and rum', 8500, 'drinks-6.jpg', 4),
('Red Wine Glass', 'Premium red wine selection', 10000, 'drinks-7.jpg', 4),
('White Wine Glass', 'Chilled white wine selection', 10000, 'drinks-8.jpg', 4),
('Craft Beer', 'Local craft beer on tap', 6000, 'drinks-9.jpg', 4),
('Sparkling Water', 'Premium sparkling mineral water', 2500, 'drinks-10.jpg', 4),
('Passion Fruit Juice', 'Fresh passion fruit juice', 5000, 'drinks-11.jpg', 4),
('Green Tea', 'Premium Japanese green tea', 3500, 'drinks-12.jpg', 4),
('Pineapple Juice', 'Freshly squeezed tropical pineapple juice', 4800, 'drinks-13.jpg', 4),
('Strawberry Smoothie', 'Creamy strawberry smoothie with banana and yogurt', 5800, 'drinks-14.jpg', 4),
('Americano', 'Double shot espresso with hot water', 3500, 'drinks-15.jpg', 4),
('Margarita', 'Classic tequila cocktail with lime and salt rim', 9500, 'drinks-16.jpg', 4),
('Champagne Glass', 'Premium French champagne', 15000, 'drinks-17.jpg', 4),
('Whiskey Sour', 'Bourbon with lemon juice and simple syrup', 10500, 'drinks-18.jpg', 4);

-- ============================================
-- Insert Menu Items - DESSERTS
-- ============================================
INSERT INTO menu_items (name, description, price, image, category_id) VALUES
('Chocolate Lava Cake', 'Warm chocolate cake with molten center, served with vanilla ice cream', 10500, 'dessert-1.jpg', 5),
('Tiramisu', 'Classic Italian dessert with espresso-soaked ladyfingers and mascarpone', 9500, 'dessert-2.jpg', 5),
('Crème Brûlée', 'Vanilla custard with caramelized sugar crust', 8500, 'dessert-3.jpg', 5),
('Cheesecake', 'New York style cheesecake with berry compote', 9800, 'dessert-4.jpg', 5),
('Apple Tart', 'French apple tart with cinnamon and vanilla ice cream', 9200, 'dessert-5.jpg', 5),
('Panna Cotta', 'Silky Italian cream dessert with raspberry coulis', 8000, 'dessert-6.jpg', 5),
('Chocolate Mousse', 'Rich dark chocolate mousse with whipped cream', 7500, 'dessert-7.jpg', 5),
('Ice Cream Trio', 'Three scoops: vanilla, chocolate, and strawberry', 6800, 'dessert-8.jpg', 5),
('Lemon Tart', 'Tangy lemon custard in buttery pastry shell', 8800, 'dessert-9.jpg', 5),
('Brownie Sundae', 'Warm chocolate brownie with vanilla ice cream and hot fudge', 10000, 'dessert-10.jpg', 5),
('Macarons Assortment', 'Six French macarons in assorted flavors', 8500, 'dessert-11.jpg', 5),
('Banoffee Pie', 'Banana and toffee pie with whipped cream', 9200, 'dessert-12.jpg', 5);

-- ============================================
-- Verify Data
-- ============================================
SELECT 'Categories Created:' AS Status, COUNT(*) AS Count FROM categories;
SELECT 'Menu Items Created:' AS Status, COUNT(*) AS Count FROM menu_items;
SELECT c.name AS Category, COUNT(m.id) AS Items 
FROM categories c 
LEFT JOIN menu_items m ON c.id = m.category_id 
GROUP BY c.id, c.name;

-- ============================================
-- Sample Queries for Testing
-- ============================================

-- Get all menu items with category names
-- SELECT m.id, m.name, m.description, m.price, m.image, c.name AS category
-- FROM menu_items m
-- JOIN categories c ON m.category_id = c.id
-- WHERE m.is_available = TRUE
-- ORDER BY c.id, m.name;

-- Get items by category
-- SELECT m.* FROM menu_items m
-- JOIN categories c ON m.category_id = c.id
-- WHERE c.name = 'Dinner' AND m.is_available = TRUE;

-- Get all categories
-- SELECT * FROM categories ORDER BY name;

-- ============================================
-- END OF SCHEMA
-- ============================================
