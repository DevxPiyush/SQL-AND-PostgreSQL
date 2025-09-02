import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

// ✅ PostgreSQL connection (db: sample, user: postgres, pass: 12345)
const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "sample",
  password: "12345",
  port: 5432,
});
db.connect()
  .then(() => console.log("✅ Connected to PostgreSQL"))
  .catch((err) => console.error("❌ Database connection failed:", err));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let currentUserId = 1;
let users = [];

// ✅ Fetch visited countries for the current user
async function checkVisited() {
  const result = await db.query(
    `SELECT country_code 
     FROM visited_countries 
     WHERE user_id = $1;`,
    [currentUserId]
  );
  return result.rows.map((row) => row.country_code);
}

// ✅ Get current user directly
async function getCurrentUser() {
  const result = await db.query("SELECT * FROM users WHERE id = $1", [
    currentUserId,
  ]);
  return result.rows[0];
}

// ✅ Homepage
app.get("/", async (req, res) => {
  try {
    const countries = await checkVisited();
    const currentUser = await getCurrentUser();
    const result = await db.query("SELECT * FROM users");
    users = result.rows;

    res.render("index.ejs", {
      countries: countries,
      total: countries.length,
      users: users,
      color: currentUser?.color || "white",
    });
  } catch (err) {
    console.error(err);
    res.send("Error loading data");
  }
});

// ✅ Add visited country
app.post("/add", async (req, res) => {
  const input = req.body["country"];

  try {
    const result = await db.query(
      "SELECT country_code FROM countries WHERE LOWER(country_name) LIKE '%' || $1 || '%';",
      [input.toLowerCase()]
    );

    if (!result.rows.length) {
      console.log("Country not found:", input);
      return res.redirect("/");
    }

    const countryCode = result.rows[0].country_code;

    await db.query(
      "INSERT INTO visited_countries (country_code, user_id) VALUES ($1, $2)",
      [countryCode, currentUserId]
    );

    res.redirect("/");
  } catch (err) {
    console.error("Insert failed:", err);
    res.redirect("/");
  }
});

// ✅ Switch user or go to add new
app.post("/user", async (req, res) => {
  if (req.body.add === "new") {
    res.render("new.ejs");
  } else {
    currentUserId = parseInt(req.body.user);
    res.redirect("/");
  }
});

// ✅ Create new user
app.post("/new", async (req, res) => {
  const { name, color } = req.body;

  try {
    const result = await db.query(
      "INSERT INTO users (name, color) VALUES ($1, $2) RETURNING *;",
      [name, color]
    );

    currentUserId = result.rows[0].id;
    res.redirect("/");
  } catch (err) {
    console.error("User creation failed:", err);
    res.redirect("/");
  }
});

app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
