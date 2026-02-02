-- CarRent initial users (idempotent - skips if email exists)
INSERT INTO users (email, password, full_name, role)
SELECT * FROM (SELECT 'admin@carrent.com' AS email, '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG' AS password, 'System Admin' AS full_name, 'ADMIN' AS role) AS tmp
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'admin@carrent.com') LIMIT 1;

INSERT INTO users (email, password, full_name, role)
SELECT * FROM (SELECT 'owner@carrent.com' AS email, '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG' AS password, 'John Owner' AS full_name, 'OWNER' AS role) AS tmp
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'owner@carrent.com') LIMIT 1;

INSERT INTO users (email, password, full_name, role)
SELECT * FROM (SELECT 'user@carrent.com' AS email, '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG' AS password, 'Jane Customer' AS full_name, 'USER' AS role) AS tmp
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'user@carrent.com') LIMIT 1;
