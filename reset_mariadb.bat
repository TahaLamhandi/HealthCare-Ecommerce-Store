@echo off
echo ========================================
echo MariaDB Complete Reset Script
echo ========================================

echo Step 1: Stopping all MySQL/MariaDB processes...
taskkill /f /im mysqld.exe 2>nul
taskkill /f /im mysql.exe 2>nul
timeout /t 3 /nobreak >nul

echo Step 2: Backing up current data...
if not exist "C:\xampp\mysql\data_backup" (
    mkdir "C:\xampp\mysql\data_backup"
)

echo Step 3: Removing user permission tables...
del "C:\xampp\mysql\data\mysql\global_priv.*" 2>nul
del "C:\xampp\mysql\data\mysql\user.*" 2>nul

echo Step 4: Starting MariaDB in safe mode...
start /b C:\xampp\mysql\bin\mysqld.exe --skip-grant-tables --skip-networking --port=3306 --datadir="C:\xampp\mysql\data" --console

echo Waiting for MariaDB to start...
timeout /t 10 /nobreak >nul

echo Step 5: Recreating user permissions...
C:\xampp\mysql\bin\mysql.exe -u root --port=3306 --protocol=TCP --execute="FLUSH PRIVILEGES; CREATE DATABASE IF NOT EXISTS bioecleel; DELETE FROM mysql.global_priv WHERE User='root'; INSERT INTO mysql.global_priv VALUES ('localhost','root','{\"access\":18446744073709551615,\"plugin\":\"mysql_native_password\",\"authentication_string\":\"\",\"auth_or\":[{},{}]}'); INSERT INTO mysql.global_priv VALUES ('127.0.0.1','root','{\"access\":18446744073709551615,\"plugin\":\"mysql_native_password\",\"authentication_string\":\"\",\"auth_or\":[{},{}]}'); INSERT INTO mysql.global_priv VALUES ('::1','root','{\"access\":18446744073709551615,\"plugin\":\"mysql_native_password\",\"authentication_string\":\"\",\"auth_or\":[{},{}]}'); FLUSH PRIVILEGES;"

echo Step 6: Stopping safe mode...
taskkill /f /im mysqld.exe 2>nul
timeout /t 5 /nobreak >nul

echo ========================================
echo Reset complete! 
echo Please restart MariaDB through XAMPP Control Panel
echo ========================================
pause
