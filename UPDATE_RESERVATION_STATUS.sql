-- Run this in MySQL Workbench to add 'completed' status to reservations

USE glimpse_restaurant_kigali;

ALTER TABLE reservations 
MODIFY COLUMN status ENUM('pending', 'approved', 'rejected', 'cancelled', 'completed') DEFAULT 'pending';
