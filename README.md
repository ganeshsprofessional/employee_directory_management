# 🏢 Employee Directory Management System

A **Node.js + PostgreSQL** backend for managing employees, departments, and roles — with secure authentication, role-based access, and HR/admin operations.

---

## ✨ Features

- 🔐 Authentication with bcrypt-hashed passwords  
- 👥 Role-based user system (`admin`, `hr`, `employee`)  
- 🏬 Department & Employee management  
- 📅 Audit fields like `created_by`, `date_of_joining`, etc.  
- ⚙️ Easy database seeding with real sample data  

---

## 🚀 Tech Stack

| Layer | Technology |
|-------|-------------|
| Backend | Node.js (Express) |
| Database | PostgreSQL |
| Query | node-postgres (`pg`) |
| Auth | bcrypt password hashing |
| Config | dotenv |
| Dev Tools | nodemon, eslint |

---

## 📁 Project Structure

```code
.
├── backend-netlify
│   ├── netlify
│   │   └── functions
│   │       └── api.js
│   ├── package.json
│   ├── seed.sql
│   └── src
│       ├── app.js
│       ├── db.js
│       ├── middleware
│       │   └── auth.js
│       ├── routes
│       │   ├── auth.js
│       │   ├── departments.js
│       │   ├── employees.js
│       │   └── users.js
│       ├── seed.js
│       └── seed_employees.js
├── eslint.config.js
├── index.html
├── netlify.toml
├── package-lock.json
├── package.json
├── src
│   ├── App.jsx
│   ├── api
│   │   └── api.js
│   ├── components
│   │   └── ProtectedRoute.jsx
│   ├── main.jsx
│   ├── pages
│   │   ├── AdminUsers.jsx
│   │   ├── EmployeeForm.jsx
│   │   ├── Employees.jsx
│   │   └── Login.jsx
│   └── style.css
└── vite.config.js
```

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the Repository
```code
git clone https://github.com/ganeshsprofessional/employee_directory_management.git
cd employee_directory_management/backend-netlify
```

### 2️⃣ Install Dependencies
```code
npm install
```

### 3️⃣ Setup Environment Variables
Create a `.env` file in the project root:

```code
DATABASE_URL=postgresql://<user>:<password>@localhost:5432/employee_db
PORT=5000
JWT_SECRET=supersecretkey
```
### 4️⃣ Initialize the Database
Make sure PostgreSQL is running, then create the database:

```code
createdb employee_db
```


### 5️⃣ Run the Seed Script
This adds roles, departments, admin, HR user, and sample employees.

```code
node src/seed.js
```

To add 100 random Tamil employees:

```code
node src/seed_employees.js
```

### 6️⃣ Start the Server
```code
npm start
```

Server runs on [http://localhost:5000](http://localhost:5000)

---

## 🔑 API Documentation

### 🔐 Auth Routes

**POST /api/auth/login**  
Login with email and password.

**Request Body**
```code
{
  "email": "admin@example.com",
  "password": "admin123"
}
```

**Response**
```code
{
  "token": "jwt-token",
  "user": {
    "id": 1,
    "email": "admin@example.com",
    "role": "admin",
    "full_name": "Site Admin"
  }
}
```

---

### 👥 Employee Routes

**GET /api/employees**  
Get a list of all employees. Supports optional query filters like department or name.

**Response**
```code
[
  {
    "id": 1,
    "full_name": "Amit Kumar",
    "email": "amit.kumar@example.com",
    "department": "Engineering",
    "designation": "Software Engineer",
    "date_of_joining": "2018-07-01"
  }
]
```

**GET /api/employees/:id**  
Get a single employee by ID.

**POST /api/employees** (Admin/HR only)  
Add a new employee.
```code
{
  "first_name": "Ravi",
  "last_name": "Subramanian",
  "email": "ravi.subramanian@example.com",
  "department_id": 2,
  "designation": "Software Engineer",
  "date_of_birth": "1992-06-20",
  "date_of_joining": "2021-01-10"
}
```

**PUT /api/employees/:id**  
Update employee details (Admin/HR only).

**DELETE /api/employees/:id**  
Delete an employee record (Admin only).

---

### 🏬 Department Routes

**GET /api/departments**  
Get all departments.

**POST /api/departments** (Admin only)
```code
{ "name": "Research & Development" }
```

---

### 🧩 Role Routes

**GET /api/roles**  
Get all roles (admin, hr, employee).

**POST /api/roles** (Admin only)
```code
{ "name": "manager" }
```

---

## 🧪 Example Admin Credentials

| Role | Email | Password |
|------|--------|-----------|
| Admin | admin@example.com | admin123 |
| HR | hr@example.com | hr123456 |

---

## 🧰 Useful Scripts

| Command | Description |
|----------|-------------|
| `npm start` | Start production server |
| `npm run dev` | Run server with nodemon |
| `node src/seed.js` | Run base seed |
| `node src/seed_employees.js` | Add 100 random Tamil employees |

---

## 🧱 Database Schema Overview

### roles
| Column | Type | Notes |
|---------|------|-------|
| id | serial | Primary key |
| name | text | Unique role name |

### departments
| Column | Type | Notes |
|---------|------|-------|
| id | serial | Primary key |
| name | text | Unique |

### users
| Column | Type | Notes |
|---------|------|-------|
| id | serial | Primary key |
| email | text | Unique |
| password_hash | text | bcrypt hash |
| role_id | integer | FK → roles |
| full_name | text |  |
| phone | text |  |

### employees
| Column | Type | Notes |
|---------|------|-------|
| id | serial | Primary key |
| first_name | text |  |
| last_name | text |  |
| full_name | text |  |
| email | text | Unique |
| phone | text |  |
| department_id | integer | FK → departments |
| designation | text |  |
| date_of_birth | date |  |
| date_of_joining | date |  |
| created_by | integer | FK → users |

---
