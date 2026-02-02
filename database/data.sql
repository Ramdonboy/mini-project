-- ============================================================================
-- CarRent Initial Data - Roles & Admin User
-- ============================================================================

-- Default password for all users: password (BCrypt encoded)
INSERT INTO users (email, password, full_name, role) VALUES
('admin@carrent.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'System Admin', 'ADMIN'),
('owner@carrent.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'John Owner', 'OWNER'),
('user@carrent.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Jane Customer', 'USER');

-- Sample cars (owner_id = 2 for owner@carrent.com)
INSERT INTO cars (model, brand, type, fuel_type, transmission, price_per_day, status, owner_id, description) VALUES
('Camry', 'Toyota', 'SEDAN', 'PETROL', 'AUTOMATIC', 45.00, 'AVAILABLE', 2, 'Reliable mid-size sedan, perfect for daily use'),
('RAV4', 'Toyota', 'SUV', 'HYBRID', 'AUTOMATIC', 65.00, 'AVAILABLE', 2, 'Spacious SUV with hybrid efficiency'),
('3 Series', 'BMW', 'LUXURY', 'PETROL', 'AUTOMATIC', 120.00, 'AVAILABLE', 2, 'Premium luxury sedan'),
('Corolla', 'Toyota', 'COMPACT', 'PETROL', 'AUTOMATIC', 35.00, 'AVAILABLE', 2, 'Compact and economical'),
('Sienna', 'Toyota', 'VAN', 'PETROL', 'AUTOMATIC', 85.00, 'AVAILABLE', 2, 'Family van with 7 seats');
