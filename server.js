require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors"); // added
const { Pool } = require("pg");

const app = express();
const port = process.env.PORT || 3001;

// Use the same env var names as db-setup.js for consistency
const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: process.env.POSTGRES_PORT,
});

app.use(express.json());
// CORS (allow frontend origin + credentials for cookie-based auth)
// Default to allowing common Next.js dev ports (3000 and 3001) to avoid surprises.
const allowedOrigins = (
  process.env.CORS_ORIGIN || "http://localhost:3000,http://localhost:3001"
)
  .split(",")
  .map((o) => o.trim());
app.use(
  cors({
    origin: function (origin, cb) {
      // allow non-browser (like test scripts) or matching origins
      if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
      return cb(new Error("Not allowed by CORS: " + origin));
    },
    credentials: true,
  })
);
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Hello from the NutriVision backend!");
});

app.get("/test-db", async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query("SELECT NOW()");
    res.json(result.rows);
    client.release();
  } catch (err) {
    console.error(err);
    res.status(500).send("Error connecting to the database");
  }
});

// Auth utilities
const { hashPassword, verifyPassword } = require("./server/utils/password");
const { signToken, verifyToken } = require("./server/utils/jwt");

// Ensure fetch is available (Node >=18 has global fetch). Fallback to node-fetch if present.
let httpFetch = global.fetch;
if (!httpFetch) {
  try {
    // Prefer optional dependency; in some deployments node-fetch may not be installed.
    // If unavailable, we'll detect later and respond with a clear error.
    httpFetch = require("node-fetch");
  } catch (e) {
    httpFetch = null;
  }
}

// Helper to find user by email
async function findUserByEmail(email) {
  const { rows } = await pool.query(
    "SELECT id, first_name, last_name, email, password_hash FROM users WHERE email = $1 LIMIT 1",
    [email]
  );
  return rows[0];
}

// Registration endpoint
app.post("/api/auth/register", async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body || {};
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password too short (min 6 chars)" });
    }
    const existing = await findUserByEmail(email);
    if (existing) {
      return res.status(409).json({ error: "Email already registered" });
    }
    const pwHash = await hashPassword(password);
    const insert = await pool.query(
      "INSERT INTO users (first_name, last_name, email, password_hash) VALUES ($1,$2,$3,$4) RETURNING id, first_name, last_name, email, created_at",
      [firstName, lastName, email, pwHash]
    );
    const user = insert.rows[0];
    res.status(201).json({ user });
  } catch (err) {
    console.error("Register error", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Login endpoint
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: "Missing credentials" });
    }
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const valid = await verifyPassword(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const token = signToken({ sub: user.id, email: user.email });
    const isProd = process.env.NODE_ENV === "production";
    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.json({
      message: "Logged in",
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
      },
    });
  } catch (err) {
    console.error("Login error", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Logout endpoint (optional convenience)
app.post("/api/auth/logout", (req, res) => {
  res.clearCookie("auth_token");
  res.json({ message: "Logged out" });
});

// Auth middleware
function authMiddleware(req, res, next) {
  const token = req.cookies?.auth_token;
  if (!token) return res.status(401).json({ error: "Unauthorized" });
  const decoded = verifyToken(token);
  if (!decoded) return res.status(401).json({ error: "Unauthorized" });
  req.user = decoded;
  next();
}

// Protected route example
app.get("/api/me", authMiddleware, async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT id, first_name, last_name, email, created_at FROM users WHERE id = $1",
      [req.user.sub]
    );
    if (!rows[0]) return res.status(404).json({ error: "User not found" });
    res.json({ user: rows[0] });
  } catch (err) {
    console.error("Get me error", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Health profile endpoints (secured)
app.get("/api/profile", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.sub;
    const { rows } = await pool.query(
      "SELECT age, gender, allergies FROM health_profiles WHERE user_id = $1",
      [userId]
    );
    if (!rows[0]) return res.json({ profile: null });
    res.json({ profile: rows[0] });
  } catch (err) {
    console.error("Get profile error", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.put("/api/profile", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.sub;
    const { age, gender, allergies } = req.body || {};
    if (age !== undefined && (isNaN(age) || age < 0 || age > 130)) {
      return res.status(400).json({ error: "Invalid age" });
    }
    const existing = await pool.query(
      "SELECT id FROM health_profiles WHERE user_id = $1",
      [userId]
    );
    if (existing.rows[0]) {
      const update = await pool.query(
        "UPDATE health_profiles SET age=$1, gender=$2, allergies=$3, updated_at=NOW() WHERE user_id=$4 RETURNING age, gender, allergies",
        [age ?? null, gender ?? null, allergies ?? null, userId]
      );
      return res.json({ profile: update.rows[0] });
    } else {
      const insert = await pool.query(
        "INSERT INTO health_profiles (user_id, age, gender, allergies) VALUES ($1,$2,$3,$4) RETURNING age, gender, allergies",
        [userId, age ?? null, gender ?? null, allergies ?? null]
      );
      return res.status(201).json({ profile: insert.rows[0] });
    }
  } catch (err) {
    console.error("Put profile error", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Nutrition lookup via USDA FoodData Central
// GET /api/nutri?q=<food name>
// Requires USDA_API_KEY in environment (.env)
app.get("/api/nutri", async (req, res) => {
  try {
    const query = (req.query.q || req.query.food || "").toString().trim();
    if (!query) {
      return res
        .status(400)
        .json({ error: "Missing 'q' (food name) query parameter" });
    }
    const apiKey = process.env.USDA_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        error: "USDA_API_KEY is not configured on the server",
        hint: "Add USDA_API_KEY to your .env and restart the server",
      });
    }

    // Search the FDC database for the food
    const searchUrl = new URL("https://api.nal.usda.gov/fdc/v1/foods/search");
    searchUrl.searchParams.set("api_key", apiKey);
    searchUrl.searchParams.set("query", query);
    searchUrl.searchParams.set("pageSize", "1");

    if (!httpFetch) {
      return res.status(500).json({
        error: "fetch is not available on this Node runtime",
        hint: "Use Node.js >= 18 or install node-fetch and ensure it's available in production",
      });
    }
    const searchResp = await httpFetch(searchUrl, {
      headers: { Accept: "application/json" },
    });
    if (!searchResp.ok) {
      const txt = await searchResp.text();
      return res
        .status(502)
        .json({ error: "USDA search failed", details: txt });
    }
    const searchData = await searchResp.json();
    const food = searchData?.foods?.[0];
    if (!food) {
      return res
        .status(404)
        .json({ error: "No nutrition data found for query", query });
    }

    // Normalize nutrients
    const nutrients = Array.isArray(food.foodNutrients)
      ? food.foodNutrients
      : [];
    const byName = (name) =>
      nutrients.find(
        (n) => n?.nutrientName?.toLowerCase() === name.toLowerCase()
      );

    const pickVal = (name) => {
      const n = byName(name);
      return typeof n?.value === "number" ? n.value : null;
    };

    const normalized = {
      query,
      food: {
        description: food.description || null,
        brandName: food.brandName || null,
        dataType: food.dataType || null,
        fdcId: food.fdcId || null,
        servingSize: food.servingSize || null,
        servingSizeUnit: food.servingSizeUnit || null,
      },
      nutrients: {
        // Common macro/micro nutrients; values are per serving or 100g depending on dataType
        calories: pickVal("Energy"), // typically kcal
        protein_g: pickVal("Protein"),
        fat_g: pickVal("Total lipid (fat)"),
        carbs_g: pickVal("Carbohydrate, by difference"),
        fiber_g: pickVal("Fiber, total dietary"),
        sugar_g:
          pickVal("Sugars, total including NLEA") ?? pickVal("Sugars, total"),
        sodium_mg: pickVal("Sodium, Na"),
      },
      source: "USDA FDC",
    };

    return res.json(normalized);
  } catch (err) {
    console.error("/api/nutri error", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Grocery aggregation (MVP without DB read):
// POST /api/grocery/aggregate
// Body: { items: [{ name, quantity, unit, category? }] }
// Returns merged list with normalized units where possible.
app.post("/api/grocery/aggregate", authMiddleware, async (req, res) => {
  try {
    const items = Array.isArray(req.body?.items) ? req.body.items : [];
    if (items.length === 0) {
      return res.json({ items: [] });
    }

    // Normalize a single item
    const norm = (item) => {
      const name = (item.name || "").trim();
      const category = (item.category || "").trim() || null;
      let qty = parseFloat(item.quantity);
      let unit = (item.unit || "").toLowerCase().trim();

      if (Number.isNaN(qty)) qty = 1;

      // Basic unit aliases
      const aliases = {
        grams: "g",
        gram: "g",
        gms: "g",
        kilograms: "kg",
        kilogram: "kg",
        kgs: "kg",
        milliliters: "ml",
        millilitre: "ml",
        litre: "l",
        liters: "l",
        cups: "cup",
        tablespoons: "tbsp",
        tablespoon: "tbsp",
        teaspoons: "tsp",
        teaspoon: "tsp",
        pieces: "pc",
        piece: "pc",
      };
      unit = aliases[unit] || unit;

      // Simple conversions to base units where reasonable
      if (unit === "kg") {
        qty = qty * 1000;
        unit = "g";
      }
      if (unit === "l") {
        qty = qty * 1000;
        unit = "ml";
      }

      return { name, category, quantity: qty, unit: unit || null };
    };

    // Merge by (name, unit) naive key
    const map = new Map();
    for (const raw of items) {
      const i = norm(raw);
      const key = `${i.name.toLowerCase()}|${i.unit || "pc"}`;
      const existing = map.get(key);
      if (existing) {
        existing.quantity += i.quantity;
      } else {
        map.set(key, { ...i });
      }
    }

    const merged = Array.from(map.values()).sort((a, b) =>
      a.name.localeCompare(b.name)
    );

    return res.json({ items: merged });
  } catch (err) {
    console.error("/api/grocery/aggregate error", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Health Rating System
// POST /api/rating
// Body: {
//   food?: { description?: string },
//   nutrients: { calories?: number, protein_g?: number, fat_g?: number, carbs_g?: number, fiber_g?: number, sugar_g?: number, sodium_mg?: number },
//   goals?: { lowSodium?: boolean }
// }
// Returns: { grade: 'A'|'B'|'C'|'D'|'E', score: number(0-100), reasons: string[], suggestions: string[] }
app.post("/api/rating", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.sub;
    const payload = req.body || {};
    const nutrients = payload.nutrients || {};
    const food = payload.food || {};
    const goals = payload.goals || {};

    // Validate minimal input
    if (
      !nutrients ||
      (nutrients.calories == null &&
        nutrients.protein_g == null &&
        nutrients.fat_g == null &&
        nutrients.carbs_g == null &&
        nutrients.fiber_g == null &&
        nutrients.sugar_g == null &&
        nutrients.sodium_mg == null)
    ) {
      return res.status(400).json({
        error:
          "Missing nutrients. Provide at least one of calories, protein_g, fat_g, carbs_g, fiber_g, sugar_g, sodium_mg.",
      });
    }

    // Fetch user health profile
    const { rows } = await pool.query(
      "SELECT age, gender, allergies FROM health_profiles WHERE user_id = $1",
      [userId]
    );
    const profile = rows[0] || null;

    // Derive goal flags from profile if not explicitly provided
    const allergyText = (profile?.allergies || "").toLowerCase();
    const descriptionText = (food?.description || "").toLowerCase();
    const profileImpliesLowSodium =
      /hypertension|blood\s*pressure|low\s*sodium/.test(allergyText);
    const isLowSodiumGoal = !!(goals?.lowSodium || profileImpliesLowSodium);

    // Simple scoring engine
    const reasons = [];
    const suggestions = [];
    let score = 50; // start neutral

    // Helper to add/subtract with reason
    const add = (pts, reason, suggestion) => {
      score += pts;
      if (reason) reasons.push(`${pts >= 0 ? "+" : ""}${pts}: ${reason}`);
      if (suggestion) suggestions.push(suggestion);
    };

    const cal = Number.isFinite(nutrients.calories) ? nutrients.calories : null;
    const protein = Number.isFinite(nutrients.protein_g)
      ? nutrients.protein_g
      : null;
    const fat = Number.isFinite(nutrients.fat_g) ? nutrients.fat_g : null;
    const carbs = Number.isFinite(nutrients.carbs_g) ? nutrients.carbs_g : null;
    const fiber = Number.isFinite(nutrients.fiber_g) ? nutrients.fiber_g : null;
    const sugar = Number.isFinite(nutrients.sugar_g) ? nutrients.sugar_g : null;
    const sodium = Number.isFinite(nutrients.sodium_mg)
      ? nutrients.sodium_mg
      : null;

    // Protein bonus
    if (protein != null) {
      const protBonus = Math.min(20, Math.max(0, protein * 1));
      if (protBonus > 0) add(protBonus, `Good protein (${protein}g)`);
    }

    // Fiber bonus
    if (fiber != null) {
      const fibBonus = Math.min(15, Math.max(0, fiber * 1.5));
      if (fibBonus > 0) add(fibBonus, `Dietary fiber (${fiber}g)`);
    }

    // Calorie ranges (per serving)
    if (cal != null) {
      if (cal < 300) add(5, `Moderate calories (${cal} kcal)`);
      else if (cal >= 300 && cal < 500)
        add(
          -5,
          `Calories on the higher side (${cal} kcal)`,
          "Consider a smaller portion or a lighter side."
        );
      else if (cal >= 500 && cal < 700)
        add(
          -10,
          `High calories (${cal} kcal)`,
          "Balance with lower-calorie meals later in the day."
        );
      else if (cal >= 700)
        add(
          -15,
          `Very high calories (${cal} kcal)`,
          "Opt for lean protein and vegetables to reduce calorie density."
        );
    }

    // Sugar ranges
    if (sugar != null) {
      if (sugar < 5) add(5, `Low sugar (${sugar}g)`);
      else if (sugar >= 5 && sugar < 15)
        add(
          -5,
          `Moderate sugar (${sugar}g)`,
          "Limit sweetened sauces or drinks."
        );
      else if (sugar >= 15 && sugar < 30)
        add(
          -10,
          `High sugar (${sugar}g)`,
          "Choose unsweetened alternatives where possible."
        );
      else if (sugar >= 30)
        add(
          -20,
          `Very high sugar (${sugar}g)`,
          "Avoid added sugars and desserts with this meal."
        );
    }

    // Fat ranges (total fat)
    if (fat != null) {
      if (fat < 15) add(5, `Lower total fat (${fat}g)`);
      else if (fat >= 15 && fat < 30)
        add(
          -5,
          `Moderate total fat (${fat}g)`,
          "Prefer grilling/baking over frying."
        );
      else if (fat >= 30)
        add(
          -10,
          `High total fat (${fat}g)`,
          "Reduce cheese, oils, or creamy dressings."
        );
    }

    // Sodium ranges (mg)
    if (sodium != null) {
      const mult = isLowSodiumGoal ? 2 : 1; // emphasize if low sodium goal
      if (sodium < 400) add(5 * mult, `Low sodium (${sodium} mg)`);
      else if (sodium >= 400 && sodium < 800)
        add(
          -5 * mult,
          `Moderate sodium (${sodium} mg)`,
          "Ask for sauces on the side and use less salt."
        );
      else if (sodium >= 800 && sodium < 1500)
        add(
          -15 * mult,
          `High sodium (${sodium} mg)`,
          "Choose low-sodium options and avoid processed meats."
        );
      else if (sodium >= 1500)
        add(
          -25 * mult,
          `Very high sodium (${sodium} mg)`,
          "Strongly consider a low-salt alternative."
        );
      if (isLowSodiumGoal)
        reasons.push("Low-sodium goal emphasized in scoring");
    }

    // Simple allergy-based red flags (very naive string contains)
    if (allergyText) {
      const flags = [];
      const allergyList = allergyText
        .split(/[,;\n]+/)
        .map((s) => s.trim())
        .filter(Boolean);
      for (const a of allergyList) {
        if (a && descriptionText && descriptionText.includes(a)) flags.push(a);
      }
      if (flags.length) {
        add(
          -20,
          `Potential allergen(s): ${flags.join(", ")}`,
          "Avoid ingredients that trigger your allergies."
        );
      }
    }

    // Carbs consideration (optional, gentle)
    if (carbs != null && carbs > 70) {
      add(
        -5,
        `High carbohydrates (${carbs}g)`,
        "Pair with protein and fiber to moderate glycemic impact."
      );
    }

    // Clamp score and map to grade
    score = Math.max(0, Math.min(100, Math.round(score)));
    let grade = "E";
    if (score >= 90) grade = "A";
    else if (score >= 75) grade = "B";
    else if (score >= 60) grade = "C";
    else if (score >= 45) grade = "D";

    return res.json({
      grade,
      score,
      reasons,
      suggestions,
      profileUsed: !!profile,
      goals: { lowSodium: isLowSodiumGoal },
    });
  } catch (err) {
    console.error("/api/rating error", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
