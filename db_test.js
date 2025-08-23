const pool = require("./db"); // your db.js

async function testDB() {
  try {
    const result = await pool.query("SELECT NOW()");
    console.log("DB connected! Current time:", result.rows[0]);
    process.exit(0); // exit after test
  } catch (err) {
    console.error("DB connection error:", err);
    process.exit(1);
  }
}

testDB();
