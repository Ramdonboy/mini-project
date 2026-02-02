# CarRent - Car Rental System

Full-stack car rental application with React, Tailwind CSS, and Spring Boot.

## Prerequisites

- **Java 17+**
- **Node.js 18+** and npm
- **MySQL 8** (running on localhost:3306)

## Quick Start

### 1. Database Setup

Create the database and run the schema:

```bash
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS carrent;"
mysql -u root -p carrent < database/schema.sql
mysql -u root -p carrent < database/data.sql
```

Update `backend/src/main/resources/application.properties` if your MySQL username/password differ:
```
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD
```

### 2. Backend

```bash
cd backend
./mvnw spring-boot:run
```

Or with Maven installed:
```bash
cd backend
mvn spring-boot:run
```

Backend runs at **http://localhost:8080**

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at **http://localhost:5173** (proxies API to backend)

### 4. Demo Accounts

| Role  | Email             | Password |
|-------|-------------------|----------|
| Admin | admin@carrent.com | password |
| Owner | owner@carrent.com | password |
| User  | user@carrent.com  | password |

## Project Structure

```
rentacar/
├── backend/          # Spring Boot API
├── frontend/         # React + Vite + Tailwind
├── database/         # schema.sql, data.sql
└── README.md
```

## Features

- **User**: Browse cars, book with date picker, 10% tax, My Bookings
- **Owner**: Add/edit/delete cars, dashboard stats, accept/reject bookings
- **Admin**: Global dashboard, manage users/cars/bookings, revenue analytics
