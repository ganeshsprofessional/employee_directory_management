require("dotenv").config();
const db = require("./db");
const bcrypt = require("bcrypt");

const firstNames = [
  "Arun",
  "Karthik",
  "Vijay",
  "Suresh",
  "Prakash",
  "Ramesh",
  "Senthil",
  "Saravanan",
  "Dinesh",
  "Manikandan",
  "Anand",
  "Kiran",
  "Rajesh",
  "Balaji",
  "Gokul",
  "Sathish",
  "Murugan",
  "Ganesh",
  "Naveen",
  "Raja",
  "Priya",
  "Kavya",
  "Divya",
  "Lakshmi",
  "Revathi",
  "Anitha",
  "Sandhya",
  "Meena",
  "Sangeetha",
  "Aishwarya",
  "Shalini",
  "Devi",
  "Keerthana",
  "Pavithra",
  "Janani",
  "Harini",
  "Bhuvana",
  "Vidhya",
  "Swathi",
  "Gayathri",
];

const lastNames = [
  "Subramanian",
  "Krishnan",
  "Raman",
  "Narayanan",
  "Ravi",
  "Muthukumar",
  "Srinivasan",
  "Venkatesan",
  "Kumar",
  "Rajendran",
  "Sekar",
  "Gopal",
  "Arumugam",
  "Chandrasekar",
  "Baskaran",
  "Manoharan",
  "Perumal",
  "Velu",
  "Sivakumar",
  "Paramasivam",
];

const designations = [
  "Software Engineer",
  "Senior Software Engineer",
  "HR Executive",
  "Accountant",
  "Marketing Executive",
  "Sales Executive",
  "Operations Manager",
  "Team Lead",
  "Business Analyst",
  "Customer Support",
];

function randomDate(start, end) {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
}

function formatDate(date) {
  return date.toISOString().split("T")[0];
}

async function seedExtraEmployees() {
  try {
    console.log("Adding 100 extra employees...");

    // Get existing data
    const admin = await db.query("SELECT id FROM users WHERE email = $1", [
      "admin@example.com",
    ]);
    const createdBy = admin.rows[0]?.id;
    if (!createdBy) throw new Error("Admin user not found");

    const depts = await db.query("SELECT id, name FROM departments");
    const deptList = depts.rows;

    for (let i = 0; i < 100; i++) {
      const first = firstNames[Math.floor(Math.random() * firstNames.length)];
      const last = lastNames[Math.floor(Math.random() * lastNames.length)];
      const full = `${first} ${last}`;

      const dept = deptList[Math.floor(Math.random() * deptList.length)];
      const desig =
        designations[Math.floor(Math.random() * designations.length)];

      const email = `${first.toLowerCase()}.${last.toLowerCase()}${Math.floor(
        Math.random() * 1000
      )}@example.com`;
      const phone = "9" + Math.floor(100000000 + Math.random() * 900000000); // 9XXXXXXXXX format

      const dob = randomDate(new Date(1985, 0, 1), new Date(1999, 11, 31));
      const doj = randomDate(new Date(2014, 0, 1), new Date(2024, 0, 1));

      await db.query(
        `INSERT INTO employees 
          (first_name, last_name, full_name, email, phone, department_id, designation, date_of_birth, date_of_joining, created_by)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
        [
          first,
          last,
          full,
          email,
          phone,
          dept.id,
          desig,
          formatDate(dob),
          formatDate(doj),
          createdBy,
        ]
      );
    }

    console.log("Added 100 employees successfully.");
    process.exit(0);
  } catch (err) {
    console.error("Error seeding extra employees:", err);
    process.exit(1);
  }
}

seedExtraEmployees();
