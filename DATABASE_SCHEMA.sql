DROP DATABASE IF EXISTS glimpse_restaurant_kigali;
CREATE DATABASE glimpse_restaurant_kigali;
USE glimpse_restaurant_kigali;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(120) NOT NULL,
  email VARCHAR(120) UNIQUE NOT NULL,
  phone VARCHAR(30),
  password VARCHAR(255) NOT NULL,
  role ENUM('customer', 'admin', 'waiter') NOT NULL DEFAULT 'customer',
  status ENUM('pending', 'active', 'rejected') NOT NULL DEFAULT 'active',
  must_change_password TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(80) UNIQUE NOT NULL
);

CREATE TABLE menu_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  category_id INT NOT NULL,
  image_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

CREATE TABLE restaurant_tables (
  id INT AUTO_INCREMENT PRIMARY KEY,
  label VARCHAR(50) NOT NULL,
  seats INT NOT NULL,
  status ENUM('available', 'reserved', 'occupied') DEFAULT 'available'
);

CREATE TABLE reservations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  table_id INT NOT NULL,
  reservation_date DATE NOT NULL,
  reservation_time TIME NOT NULL,
  guests INT NOT NULL,
  notes TEXT,
  status ENUM('pending', 'approved', 'rejected', 'cancelled') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (table_id) REFERENCES restaurant_tables(id) ON DELETE CASCADE
);

CREATE TABLE orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  reservation_id INT NOT NULL,
  waiter_id INT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  tax DECIMAL(10,2) NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  notes TEXT,
  payment_status ENUM('pending', 'paid') DEFAULT 'pending',
  status ENUM('pending', 'preparing', 'served', 'completed') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (reservation_id) REFERENCES reservations(id) ON DELETE CASCADE,
  FOREIGN KEY (waiter_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  menu_item_id INT NOT NULL,
  quantity INT NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (menu_item_id) REFERENCES menu_items(id) ON DELETE CASCADE
);

CREATE TABLE notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  title VARCHAR(160) NOT NULL,
  message TEXT NOT NULL,
  is_read TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  rating INT NOT NULL,
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE gallery (
  id INT AUTO_INCREMENT PRIMARY KEY,
  image_url VARCHAR(255) NOT NULL,
  caption VARCHAR(160),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE payments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  method VARCHAR(80),
  status ENUM('pending', 'paid', 'failed') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

CREATE TABLE password_resets (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  code_hash VARCHAR(255) NOT NULL,
  expires_at DATETIME NOT NULL,
  used_at DATETIME NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE waiters (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNIQUE NOT NULL,
  hire_date DATE,
  shift_name VARCHAR(50),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Admin user (password: 2saint123)
INSERT INTO users (full_name, email, phone, password, role, status)
VALUES ('System Admin', 'rwetoussanthony@gmail.com', '0780000000', '$2a$10$IsL/41kSjwQ6pvfZgE.Wl.Xz/fNxNXOZerT5CLhN0/9YLg7/98.L2', 'admin', 'active')
ON DUPLICATE KEY UPDATE
  password = VALUES(password),
  role = 'admin',
  status = 'active',
  must_change_password = 0;

-- Categories
INSERT INTO categories (name) VALUES
('Breakfast'), ('Lunch'), ('Dinner'), ('Drinks'), ('Desserts');

-- Tables
INSERT INTO restaurant_tables (id, label, seats, status) VALUES
(1, 'Table 1', 2, 'available'),
(2, 'Table 2', 2, 'available'),
(3, 'Table 3', 4, 'available'),
(4, 'Table 4', 4, 'available'),
(5, 'Table 5', 6, 'available'),
(6, 'Table 6', 6, 'available'),
(7, 'Table 7', 8, 'available'),
(8, 'VIP 1', 4, 'available'),
(9, 'VIP 2', 4, 'available'),
(10, 'VIP 3', 6, 'available');

-- Menu Items - Breakfast
INSERT INTO menu_items (name, description, price, category_id, image_url) VALUES
('Eggs Benedict', 'Poached eggs on English muffin with hollandaise sauce and Canadian bacon', 8500, 1, 'https://images.unsplash.com/photo-1608039829572-78524f79c4c7?auto=format&fit=crop&w=900&q=80'),
('French Toast', 'Brioche bread soaked in vanilla custard, served with fresh berries and maple syrup', 7000, 1, 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?auto=format&fit=crop&w=900&q=80'),
('Avocado Toast', 'Smashed avocado on sourdough with poached eggs, cherry tomatoes, and feta', 9500, 1, 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?auto=format&fit=crop&w=900&q=80'),
('Pancake Stack', 'Fluffy buttermilk pancakes with whipped cream, berries, and honey', 6500, 1, 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=900&q=80'),
('Continental Breakfast', 'Croissants, fresh fruit, yogurt, granola, and orange juice', 12000, 1, 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=900&q=80'),
('Omelette Deluxe', 'Three-egg omelette with mushrooms, cheese, spinach, and herbs', 8000, 1, 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?auto=format&fit=crop&w=900&q=80');

-- Menu Items - Lunch
INSERT INTO menu_items (name, description, price, category_id, image_url) VALUES
('Caesar Salad', 'Crisp romaine lettuce with parmesan, croutons, and classic Caesar dressing', 11000, 2, 'https://images.unsplash.com/photo-1546793665-c74683f339c1?auto=format&fit=crop&w=900&q=80'),
('Grilled Chicken Sandwich', 'Marinated chicken breast with lettuce, tomato, and aioli on ciabatta', 13500, 2, 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?auto=format&fit=crop&w=900&q=80'),
('Beef Burger Deluxe', 'Angus beef patty with cheddar, bacon, caramelized onions, and truffle fries', 16000, 2, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=80'),
('Pasta Carbonara', 'Creamy pasta with pancetta, parmesan, and black pepper', 14500, 2, 'https://images.unsplash.com/photo-1612874742237-6526221588e3?auto=format&fit=crop&w=900&q=80'),
('Fish Tacos', 'Grilled tilapia with cabbage slaw, avocado, and chipotle mayo', 15000, 2, 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&w=900&q=80'),
('Quinoa Buddha Bowl', 'Roasted vegetables, chickpeas, quinoa, and tahini dressing', 12500, 2, 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=900&q=80'),
('Club Sandwich', 'Triple-decker with turkey, bacon, lettuce, tomato, and mayo', 13000, 2, 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=900&q=80');

-- Menu Items - Dinner
INSERT INTO menu_items (name, description, price, category_id, image_url) VALUES
('Grilled Ribeye Steak', 'Premium 300g ribeye with herb butter, roasted potatoes, and seasonal vegetables', 28000, 3, 'https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&w=900&q=80'),
('Pan-Seared Salmon', 'Atlantic salmon with lemon butter sauce, asparagus, and wild rice', 24000, 3, 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=900&q=80'),
('Lamb Chops', 'Herb-crusted lamb chops with mint jelly, mashed potatoes, and green beans', 32000, 3, 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=900&q=80'),
('Lobster Thermidor', 'Whole lobster in creamy cognac sauce with gruyere cheese', 45000, 3, 'https://images.unsplash.com/photo-1625944525533-473f1a3d54e7?auto=format&fit=crop&w=900&q=80'),
('Beef Wellington', 'Tender beef fillet wrapped in puff pastry with mushroom duxelles', 38000, 3, 'https://images.unsplash.com/photo-1595777216528-071e0127ccf4?auto=format&fit=crop&w=900&q=80'),
('Seafood Paella', 'Spanish rice with prawns, mussels, calamari, and saffron', 26000, 3, 'https://images.unsplash.com/photo-1534080564583-6be75777b70a?auto=format&fit=crop&w=900&q=80'),
('Duck Confit', 'Slow-cooked duck leg with orange glaze and roasted root vegetables', 29000, 3, 'https://images.unsplash.com/photo-1609501676725-7186f017a4b7?auto=format&fit=crop&w=900&q=80'),
('Vegetarian Risotto', 'Creamy arborio rice with wild mushrooms, truffle oil, and parmesan', 18000, 3, 'https://images.unsplash.com/photo-1476124369491-c4f9c6c6c8c7?auto=format&fit=crop&w=900&q=80');

-- Menu Items - Drinks
INSERT INTO menu_items (name, description, price, category_id, image_url) VALUES
('Fresh Orange Juice', 'Freshly squeezed orange juice', 3500, 4, 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=900&q=80'),
('Mango Smoothie', 'Tropical mango smoothie with yogurt and honey', 4500, 4, 'https://images.unsplash.com/photo-1505252585461-04db1eb84625?auto=format&fit=crop&w=900&q=80'),
('Espresso', 'Rich Italian espresso', 2500, 4, 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&w=900&q=80'),
('Cappuccino', 'Classic cappuccino with steamed milk foam', 3500, 4, 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=900&q=80'),
('Iced Latte', 'Cold espresso with milk and ice', 4000, 4, 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?auto=format&fit=crop&w=900&q=80'),
('Mojito', 'Classic mojito with fresh mint, lime, and rum', 7000, 4, 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?auto=format&fit=crop&w=900&q=80'),
('Red Wine Glass', 'Premium red wine selection', 8500, 4, 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=900&q=80'),
('White Wine Glass', 'Chilled white wine selection', 8500, 4, 'https://images.unsplash.com/photo-1547595628-c61a29f496f0?auto=format&fit=crop&w=900&q=80'),
('Craft Beer', 'Local craft beer on tap', 5000, 4, 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?auto=format&fit=crop&w=900&q=80'),
('Sparkling Water', 'Premium sparkling mineral water', 2000, 4, 'https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&w=900&q=80'),
('Passion Fruit Juice', 'Fresh passion fruit juice', 4000, 4, 'https://images.unsplash.com/photo-1622597467836-f3285f2131b8?auto=format&fit=crop&w=900&q=80'),
('Green Tea', 'Premium Japanese green tea', 3000, 4, 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?auto=format&fit=crop&w=900&q=80');

-- Menu Items - Desserts
INSERT INTO menu_items (name, description, price, category_id, image_url) VALUES
('Chocolate Lava Cake', 'Warm chocolate cake with molten center, served with vanilla ice cream', 8500, 5, 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?auto=format&fit=crop&w=900&q=80'),
('Tiramisu', 'Classic Italian dessert with espresso-soaked ladyfingers and mascarpone', 7500, 5, 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=900&q=80'),
('Crème Brûlée', 'Vanilla custard with caramelized sugar crust', 7000, 5, 'https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?auto=format&fit=crop&w=900&q=80'),
('Cheesecake', 'New York style cheesecake with berry compote', 8000, 5, 'https://images.unsplash.com/photo-1533134242820-b4f3b4e0c2b7?auto=format&fit=crop&w=900&q=80'),
('Apple Tart', 'French apple tart with cinnamon and vanilla ice cream', 7500, 5, 'https://images.unsplash.com/photo-1535920527002-b35e96722eb9?auto=format&fit=crop&w=900&q=80'),
('Panna Cotta', 'Silky Italian cream dessert with raspberry coulis', 6500, 5, 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=900&q=80'),
('Chocolate Mousse', 'Rich dark chocolate mousse with whipped cream', 6000, 5, 'https://images.unsplash.com/photo-1541599468348-e96984315921?auto=format&fit=crop&w=900&q=80'),
('Ice Cream Trio', 'Three scoops: vanilla, chocolate, and strawberry', 5500, 5, 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=900&q=80');
