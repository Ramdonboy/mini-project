-- ============================================================================
-- CarRent Database Schema - 3NF Normalized
-- DBMS: MySQL 8.x
-- ============================================================================

-- Drop existing objects (in reverse dependency order)
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS cars;
DROP TABLE IF EXISTS users;
SET FOREIGN_KEY_CHECKS = 1;

-- ----------------------------------------------------------------------------
-- Users Table (3NF - atomic values, no partial dependencies)
-- ----------------------------------------------------------------------------
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role ENUM('ADMIN', 'OWNER', 'USER') NOT NULL DEFAULT 'USER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT uk_users_email UNIQUE (email),
    CONSTRAINT chk_users_role CHECK (role IN ('ADMIN', 'OWNER', 'USER'))
);

-- Index for role-based queries (Admin dashboard, Owner lookups)
CREATE INDEX idx_users_role ON users(role);

-- ----------------------------------------------------------------------------
-- Cars Table (3NF - owner_id references users)
-- Referential Integrity: ON DELETE RESTRICT - cannot delete owner with cars
-- ----------------------------------------------------------------------------
CREATE TABLE cars (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    model VARCHAR(100) NOT NULL,
    brand VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL,
    fuel_type VARCHAR(50) NOT NULL,
    transmission VARCHAR(50) NOT NULL,
    price_per_day DECIMAL(10, 2) NOT NULL,
    status ENUM('AVAILABLE', 'RENTED', 'MAINTENANCE', 'INACTIVE') NOT NULL DEFAULT 'AVAILABLE',
    owner_id BIGINT NOT NULL,
    description TEXT,
    image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_cars_owner FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE RESTRICT,
    CONSTRAINT chk_cars_price CHECK (price_per_day > 0),
    CONSTRAINT chk_cars_type CHECK (type IN ('SEDAN', 'SUV', 'LUXURY', 'COMPACT', 'VAN')),
    CONSTRAINT chk_cars_status CHECK (status IN ('AVAILABLE', 'RENTED', 'MAINTENANCE', 'INACTIVE'))
);

-- Query Optimization: Index on car_type for Fleet Distribution stats (Sedan vs SUV vs Luxury)
CREATE INDEX idx_cars_type ON cars(type);
-- Index for owner dashboard - filter cars by owner
CREATE INDEX idx_cars_owner ON cars(owner_id);
-- Composite index for availability + type filters
CREATE INDEX idx_cars_status_type ON cars(status, type);

-- ----------------------------------------------------------------------------
-- Bookings Table (3NF - user_id and car_id reference other entities)
-- Referential Integrity: ON DELETE RESTRICT - preserve booking history
-- ----------------------------------------------------------------------------
CREATE TABLE bookings (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    car_id BIGINT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_price DECIMAL(12, 2) NOT NULL,
    status ENUM('PENDING', 'CONFIRMED', 'REJECTED', 'CANCELLED', 'COMPLETED') NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_bookings_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT,
    CONSTRAINT fk_bookings_car FOREIGN KEY (car_id) REFERENCES cars(id) ON DELETE RESTRICT,
    CONSTRAINT chk_bookings_dates CHECK (end_date >= start_date),
    CONSTRAINT chk_bookings_total_price CHECK (total_price >= 0),
    CONSTRAINT chk_bookings_status CHECK (status IN ('PENDING', 'CONFIRMED', 'REJECTED', 'CANCELLED', 'COMPLETED'))
);

-- Query Optimization: Index on booking_dates for availability checks (prevents double-booking)
CREATE INDEX idx_bookings_dates ON bookings(start_date, end_date);
CREATE INDEX idx_bookings_car_dates ON bookings(car_id, start_date, end_date);
CREATE INDEX idx_bookings_user ON bookings(user_id);
CREATE INDEX idx_bookings_status ON bookings(status);

-- ----------------------------------------------------------------------------
-- DBMS Documentation: Key Implementations
-- ----------------------------------------------------------------------------
-- 1. REFERENTIAL INTEGRITY: Foreign keys with ON DELETE RESTRICT ensure
--    - Cars cannot be deleted if they have bookings (preserve history)
--    - Owners cannot be deleted if they have cars
-- 2. DATA VALIDATION: CHECK constraints on price_per_day > 0, email UNIQUE
-- 3. INDEXES: car_type for Fleet Distribution, booking_dates for availability
-- 4. ACID TRANSACTIONS: Implemented in Spring Boot @Transactional for booking
