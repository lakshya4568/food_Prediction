#!/usr/bin/env node
/**
 * Test /api/rating endpoint by creating a user, logging in, saving a profile,
 * then calling /api/rating with nutrition for two cases to observe differences.
 */
const fetch = require("node-fetch");
const base = `http://localhost:${process.env.PORT || 3001}`;

async function run() {
  const email = `rate_${Date.now()}@example.com`;
  const password = "TestPass123";
  const jar = {};
  const saveCookies = (res) => {
    const set = res.headers.raw()["set-cookie"];
    if (set) {
      const first = set[0];
      const token = first.split(";")[0];
      jar.cookie = token;
    }
  };
  const opts = (method, body, contentType = "application/json") => ({
    method,
    headers: {
      ...(contentType ? { "Content-Type": contentType } : {}),
      ...(jar.cookie ? { Cookie: jar.cookie } : {}),
    },
    body: body ? (contentType ? JSON.stringify(body) : body) : undefined,
  });

  console.log("Registering user...");
  let res = await fetch(
    base + "/api/auth/register",
    opts("POST", { firstName: "Rate", lastName: "Tester", email, password })
  );
  console.log("Register status", res.status);
  if (res.status !== 201) {
    console.error("Register failed", await res.text());
    process.exit(1);
  }

  console.log("Logging in...");
  res = await fetch(
    base + "/api/auth/login",
    opts("POST", { email, password })
  );
  saveCookies(res);
  console.log("Login status", res.status, "cookie saved?", !!jar.cookie);
  if (res.status !== 200 || !jar.cookie) {
    console.error("Login failed", await res.text());
    process.exit(1);
  }

  console.log(
    "Saving health profile with low-sodium goal implied (hypertension)..."
  );
  res = await fetch(
    base + "/api/profile",
    opts("PUT", { age: 45, gender: "male", allergies: "hypertension" })
  );
  console.log("Profile save status", res.status);
  if (!res.ok) {
    console.error("Profile save failed", await res.text());
    process.exit(1);
  }

  const sampleNutrients = {
    calories: 650,
    protein_g: 30,
    fat_g: 28,
    carbs_g: 55,
    fiber_g: 6,
    sugar_g: 12,
    sodium_mg: 1400,
  };

  console.log("Requesting rating for high-sodium meal...");
  res = await fetch(
    base + "/api/rating",
    opts("POST", {
      food: { description: "Cheese pizza" },
      nutrients: sampleNutrients,
    })
  );
  console.log("Rating status", res.status);
  const rating1 = await res.json();
  console.log("Rating 1:", rating1);

  console.log("Updating profile to remove low-sodium implication...");
  res = await fetch(
    base + "/api/profile",
    opts("PUT", { age: 45, gender: "male", allergies: "" })
  );
  console.log("Profile save status", res.status);

  console.log("Requesting rating again for same meal...");
  res = await fetch(
    base + "/api/rating",
    opts("POST", {
      food: { description: "Cheese pizza" },
      nutrients: sampleNutrients,
    })
  );
  console.log("Rating status", res.status);
  const rating2 = await res.json();
  console.log("Rating 2:", rating2);

  if (rating1.score <= rating2.score) {
    console.log(
      "As expected, low-sodium goal penalized the first rating more."
    );
  } else {
    console.warn("Unexpected: first rating score > second score");
  }
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
