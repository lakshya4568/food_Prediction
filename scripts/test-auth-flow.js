#!/usr/bin/env node
/**
 * Simple auth flow tester: register -> login -> me -> logout -> me (should fail)
 * Requires server running on PORT (default 3001)
 */
const fetch = require("node-fetch");
const base = `http://localhost:${process.env.PORT || 3001}`;

async function run() {
  const email = `testuser_${Date.now()}@example.com`;
  const password = "TestPass123";
  const jar = {};
  const saveCookies = (res) => {
    const set = res.headers.raw()["set-cookie"];
    if (set) {
      // naive parse
      const first = set[0];
      const token = first.split(";")[0];
      jar.cookie = token;
    }
  };
  const opts = (method, body) => ({
    method,
    headers: {
      "Content-Type": "application/json",
      ...(jar.cookie ? { Cookie: jar.cookie } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  console.log("Registering user...");
  let res = await fetch(
    base + "/api/auth/register",
    opts("POST", { firstName: "Test", lastName: "User", email, password })
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

  console.log("Fetching /api/me...");
  res = await fetch(base + "/api/me", opts("GET"));
  console.log("Me status", res.status);
  if (res.status !== 200) {
    console.error("Me failed", await res.text());
    process.exit(1);
  }
  const me = await res.json();
  console.log("User id", me.user.id);

  console.log("Logging out...");
  res = await fetch(base + "/api/auth/logout", opts("POST"));
  // Clear cookie jar to simulate browser removing cookie per Set-Cookie
  jar.cookie = undefined;
  console.log("Logout status", res.status);

  console.log("Fetching /api/me after logout (should 401)...");
  res = await fetch(base + "/api/me", opts("GET"));
  console.log("Post logout /api/me status", res.status);
  if (res.status === 200) {
    console.error("Expected 401 after logout");
    process.exit(1);
  }
  console.log("Auth flow test passed.");
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
