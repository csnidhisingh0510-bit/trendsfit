-- TrendFits Database Schema (MySQL Compatible)
-- Created for Phase 1 of TrendFits Application

CREATE DATABASE IF NOT EXISTS trendfits;
USE trendfits;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('registered', 'guest') DEFAULT 'registered',
    style_preference VARCHAR(100) DEFAULT 'Casual', -- e.g., 'Casual', 'Elegant', 'Minimalist', 'Athletic'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Wardrobe Items Table
CREATE TABLE IF NOT EXISTS wardrobe_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    category ENUM('top', 'bottom', 'footwear', 'outerwear', 'accessory') NOT NULL,
    color VARCHAR(50) NOT NULL,
    season ENUM('spring', 'summer', 'autumn', 'winter', 'all_season') NOT NULL,
    occasion ENUM('casual', 'work', 'party', 'workout') NOT NULL,
    image_url TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Outfits Table (Pre-defined or dynamically generated combinations)
CREATE TABLE IF NOT EXISTS outfits (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) DEFAULT NULL,
    top_id INT NOT NULL,
    bottom_id INT NOT NULL,
    footwear_id INT NOT NULL,
    outerwear_id INT DEFAULT NULL,
    occasion ENUM('casual', 'work', 'party', 'workout') NOT NULL,
    weather ENUM('hot', 'cold', 'rainy', 'moderate') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (top_id) REFERENCES wardrobe_items(id) ON DELETE CASCADE,
    FOREIGN KEY (bottom_id) REFERENCES wardrobe_items(id) ON DELETE CASCADE,
    FOREIGN KEY (footwear_id) REFERENCES wardrobe_items(id) ON DELETE CASCADE,
    FOREIGN KEY (outerwear_id) REFERENCES wardrobe_items(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Saved Favourites Table
CREATE TABLE IF NOT EXISTS saved_favourites (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    top_id INT NOT NULL,
    bottom_id INT NOT NULL,
    footwear_id INT NOT NULL,
    outerwear_id INT DEFAULT NULL,
    occasion ENUM('casual', 'work', 'party', 'workout') NOT NULL,
    weather ENUM('hot', 'cold', 'rainy', 'moderate') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (top_id) REFERENCES wardrobe_items(id) ON DELETE CASCADE,
    FOREIGN KEY (bottom_id) REFERENCES wardrobe_items(id) ON DELETE CASCADE,
    FOREIGN KEY (footwear_id) REFERENCES wardrobe_items(id) ON DELETE CASCADE,
    FOREIGN KEY (outerwear_id) REFERENCES wardrobe_items(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed initial data for demonstration purposes
INSERT INTO users (id, email, password_hash, role, style_preference) VALUES
(1, 'cs.nidhisingh0510@gmail.com', '$2a$10$W1eX.98C.Obe5V8T9S3v.eU/05R0V.6GqFfK5B2KzMvFpW7h0N2bS', 'registered', 'Minimalist'),
(2, 'guest@trendfits.app', '$2a$10$W1eX.98C.Obe5V8T9S3v.eU/05R0V.6GqFfK5B2KzMvFpW7h0N2bS', 'guest', 'Casual');

INSERT INTO wardrobe_items (id, user_id, name, category, color, season, occasion, image_url) VALUES
-- Tops
(1, 1, 'Classic White Linen Shirt', 'top', 'White', 'summer', 'casual', 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=400'),
(2, 1, 'Black Merino Wool Sweater', 'top', 'Black', 'winter', 'work', 'https://images.unsplash.com/photo-1614975058789-41316d0e2e9c?auto=format&fit=crop&q=80&w=400'),
(3, 1, 'Silk Champagne Blouse', 'top', 'Champagne', 'autumn', 'party', 'https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?auto=format&fit=crop&q=80&w=400'),
(4, 1, 'Dry-Fit Athletic Tee', 'top', 'Slate Gray', 'all_season', 'workout', 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=400'),
-- Bottoms
(5, 1, 'Sand Tailored Chinos', 'bottom', 'Beige', 'spring', 'work', 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&q=80&w=400'),
(6, 1, 'Dark Indigo Selvedge Jeans', 'bottom', 'Indigo', 'all_season', 'casual', 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80&w=400'),
(7, 1, 'Pleated Velvet Night Trouser', 'bottom', 'Black', 'winter', 'party', 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&q=80&w=400'),
(8, 1, 'Lightweight Breathable Shorts', 'bottom', 'Charcoal', 'summer', 'workout', 'https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&q=80&w=400'),
-- Footwear
(9, 1, 'Handmade Leather Loafers', 'footwear', 'Brown', 'all_season', 'work', 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&q=80&w=400'),
(10, 1, 'Minimalist White Sneakers', 'footwear', 'White', 'summer', 'casual', 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=400'),
(11, 1, 'Suede Ankle Heeled Boots', 'footwear', 'Taupe', 'autumn', 'party', 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=400'),
(12, 1, 'High-Performance Trainer Shoes', 'footwear', 'Neon Gray', 'all_season', 'workout', 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&q=80&w=400'),
-- Outerwear
(13, 1, 'Tailored Beige Trench Coat', 'outerwear', 'Beige', 'autumn', 'work', 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=400'),
(14, 1, 'Premium Black Leather Jacket', 'outerwear', 'Black', 'winter', 'party', 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=400');
