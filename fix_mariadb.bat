@echo off
echo Stopping MariaDB...
taskkill /f /im mysqld.exe 2>nul

echo Waiting for MariaDB to stop...
timeout /t 5 /nobreak >nul

echo Starting MariaDB in safe mode...
start /b C:\xampp\mysql\bin\mysqld.exe --skip-grant-tables --skip-networking --port=4306 --datadir="C:\xampp\mysql\data"

echo Waiting for MariaDB to start...
timeout /t 10 /nobreak >nul

echo Creating database and users...
C:\xampp\mysql\bin\mysql.exe -u root --port=4306 --protocol=TCP -e "FLUSH PRIVILEGES; CREATE DATABASE IF NOT EXISTS bioecleel; CREATE USER IF NOT EXISTS 'root'@'localhost' IDENTIFIED BY ''; CREATE USER IF NOT EXISTS 'root'@'127.0.0.1' IDENTIFIED BY ''; GRANT ALL PRIVILEGES ON *.* TO 'root'@'localhost' WITH GRANT OPTION; GRANT ALL PRIVILEGES ON *.* TO 'root'@'127.0.0.1' WITH GRANT OPTION; FLUSH PRIVILEGES;"

echo Stopping safe mode MariaDB...
taskkill /f /im mysqld.exe 2>nul

echo Waiting for MariaDB to stop...
timeout /t 5 /nobreak >nul

echo Please restart MariaDB through XAMPP Control Panel
pause
