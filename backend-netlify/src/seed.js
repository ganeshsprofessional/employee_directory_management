require("dotenv").config();
const db = require("./db");
const bcrypt = require("bcrypt");

async function seed() {
  try {
    await db.query("CREATE EXTENSION IF NOT EXISTS pg_trgm");
    await db.query(
      "INSERT INTO roles (name) VALUES ('admin') ON CONFLICT DO NOTHING"
    );
    await db.query(
      "INSERT INTO roles (name) VALUES ('hr') ON CONFLICT DO NOTHING"
    );
    await db.query(
      "INSERT INTO roles (name) VALUES ('employee') ON CONFLICT DO NOTHING"
    );

    const departments = [
      "Engineering",
      "Human Resources",
      "Finance",
      "Sales",
      "Marketing",
      "Operations",
    ];
    for (const d of departments) {
      await db.query(
        "INSERT INTO departments (name) VALUES ($1) ON CONFLICT DO NOTHING",
        [d]
      );
    }

    const adminRole = await db.query(
      "SELECT id FROM roles WHERE name = 'admin'"
    );
    const hrRole = await db.query("SELECT id FROM roles WHERE name = 'hr'");
    const empRole = await db.query(
      "SELECT id FROM roles WHERE name = 'employee'"
    );

    const adminPass = await bcrypt.hash("admin123", 10);
    const hrPass = await bcrypt.hash("hr123456", 10);

    await db.query(
      "INSERT INTO users (email, password_hash, role_id, full_name, phone) VALUES ($1,$2,$3,$4,$5) ON CONFLICT (email) DO NOTHING",
      [
        "admin@example.com",
        adminPass,
        adminRole.rows[0].id,
        "Site Admin",
        "9999999999",
      ]
    );
    await db.query(
      "INSERT INTO users (email, password_hash, role_id, full_name, phone) VALUES ($1,$2,$3,$4,$5) ON CONFLICT (email) DO NOTHING",
      ["hr@example.com", hrPass, hrRole.rows[0].id, "HR Manager", "9888888888"]
    );

    const employees = [
      {
        first: "Amit",
        last: "Kumar",
        email: "amit.kumar@example.com",
        dept: "Engineering",
        desig: "Software Engineer",
        dob: "1992-05-12",
        doj: "2018-07-01",
      },
      {
        first: "Priya",
        last: "Sharma",
        email: "priya.sharma@example.com",
        dept: "Marketing",
        desig: "Marketing Executive",
        dob: "1995-10-20",
        doj: "2020-03-15",
      },
      {
        first: "Rohit",
        last: "Verma",
        email: "rohit.verma@example.com",
        dept: "Sales",
        desig: "Sales Manager",
        dob: "1988-01-05",
        doj: "2015-08-10",
      },
      {
        first: "Sneha",
        last: "Patel",
        email: "sneha.patel@example.com",
        dept: "Human Resources",
        desig: "HR Executive",
        dob: "1993-11-30",
        doj: "2019-01-20",
      },
      {
        first: "Vikram",
        last: "Rao",
        email: "vikram.rao@example.com",
        dept: "Finance",
        desig: "Accountant",
        dob: "1990-06-18",
        doj: "2016-04-25",
      },
    ];

    // find admin user to set created_by
    const adminUser = await db.query("SELECT id FROM users WHERE email = $1", [
      "admin@example.com",
    ]);
    const createdBy = adminUser.rows[0].id;

    for (const e of employees) {
      const dept = await db.query(
        "SELECT id FROM departments WHERE name = $1",
        [e.dept]
      );
      const deptId = dept.rows[0] ? dept.rows[0].id : null;
      await db.query(
        `INSERT INTO employees (first_name,last_name,full_name,email,phone,department_id,designation,date_of_birth,date_of_joining,created_by)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) ON CONFLICT DO NOTHING`,
        [
          e.first,
          e.last,
          `${e.first} ${e.last}`,
          e.email,
          null,
          deptId,
          e.desig,
          e.dob,
          e.doj,
          createdBy,
        ]
      );
    }

    console.log("Seed complete");
    process.exit(0);
  } catch (err) {
    console.error("Seed error", err);
    process.exit(1);
  }
}

seed();
