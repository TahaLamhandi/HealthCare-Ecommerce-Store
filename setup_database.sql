-- Setup database and user permissions
FLUSH PRIVILEGES;

-- Create database
CREATE DATABASE IF NOT EXISTS bioecleel;

-- Create users for different hosts
CREATE USER IF NOT EXISTS 'root'@'localhost' IDENTIFIED BY '';
CREATE USER IF NOT EXISTS 'root'@'127.0.0.1' IDENTIFIED BY '';
CREATE USER IF NOT EXISTS 'root'@'::1' IDENTIFIED BY '';

-- Grant all privileges
GRANT ALL PRIVILEGES ON *.* TO 'root'@'localhost' WITH GRANT OPTION;
GRANT ALL PRIVILEGES ON *.* TO 'root'@'127.0.0.1' WITH GRANT OPTION;
GRANT ALL PRIVILEGES ON *.* TO 'root'@'::1' WITH GRANT OPTION;

-- Grant specific privileges for bioecleel database
GRANT ALL PRIVILEGES ON bioecleel.* TO 'root'@'localhost';
GRANT ALL PRIVILEGES ON bioecleel.* TO 'root'@'127.0.0.1';
GRANT ALL PRIVILEGES ON bioecleel.* TO 'root'@'::1';

-- Create user for Laravel
CREATE USER IF NOT EXISTS 'bioecleel_user'@'localhost' IDENTIFIED BY '';
CREATE USER IF NOT EXISTS 'bioecleel_user'@'127.0.0.1' IDENTIFIED BY '';
GRANT ALL PRIVILEGES ON bioecleel.* TO 'bioecleel_user'@'localhost';
GRANT ALL PRIVILEGES ON bioecleel.* TO 'bioecleel_user'@'127.0.0.1';

FLUSH PRIVILEGES;

-- Show users to verify
SELECT User, Host FROM mysql.user WHERE User IN ('root', 'bioecleel_user');
