# 📘 SQL Practice Setup (Docker + VS Code)

This guide helps you set up **SQL Server in Docker** and use **VS Code** for SQL practice.

---

## 🚀 Quick Setup (One Command)

Copy and paste the following into your terminal:

```bash
# Install Docker (if not already installed) - Arch Linux
sudo pacman -Syu docker --noconfirm
sudo systemctl enable --now docker
sudo usermod -aG docker $USER

# Pull latest SQL Server image
sudo docker pull mcr.microsoft.com/mssql/server:2022-latest

# Run SQL Server container
sudo docker run -e "ACCEPT_EULA=Y" \
   -e "SA_PASSWORD=StrongPass!123" \
   -p 1433:1433 --name sqlserver \
   -d mcr.microsoft.com/mssql/server:2022-latest

# Verify container is running
sudo docker ps

echo "✅ SQL Server is running on localhost:1433 (user: sa / password: StrongPass!123)"

🔗 VS Code Setup

Install VS Code.

Install extensions:

SQLTools

SQLTools MSSQL/MariaDB/TiDB Driver

Connect to server:

Server: localhost

Port: 1433

User: sa

Password: StrongPass!123

---

## 📝 Example SQL Script

Save as create.sql and run in VS Code:
-- Create table
CREATE TABLE birthday (
    id INT PRIMARY KEY,
    birthdate INT,
    birth_month INT,
    student_name VARCHAR(100)
);

-- Insert records
INSERT INTO birthday (id, birthdate, birth_month, student_name)
VALUES
(10, 24, 3, 'Swarup'),
(11, 26, 8, 'DIGVIJAY'),
(2, 12, 3, 'NANDINI');

-- Read records
SELECT * FROM birthday;

# Stop container
sudo docker stop sqlserver

# Start again
sudo docker start sqlserver


