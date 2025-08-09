#!/usr/bin/env node
/*
 Tests the parsing flow on the Node API only:
 - Registers/logs in
 - Calls /api/upload-doc with sample OCR text
 - Fetches /api/docs to verify persistence
*/
const fs = require("fs");

const NODE_BASE =
  process.env.NODE_BASE ||
  process.env.NEXT_PUBLIC_NODE_API_BASE ||
  "http://localhost:3001";

async function main() {
  const f = global.fetch || (await import("node-fetch")).default;

  const email = `parse_${Date.now()}@local.dev`;
  const password = "test1234";
  console.log("Register");
  await f(`${NODE_BASE.replace(/\/$/, "")}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ firstName: "P", lastName: "T", email, password }),
  }).catch(() => {});

  console.log("Login");
  const login = await f(`${NODE_BASE.replace(/\/$/, "")}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    redirect: "manual",
  });
  const cookie = login.headers.get("set-cookie") || "";
  console.log("Login status", login.status);

  const headers = { "Content-Type": "application/json", Cookie: cookie };

  console.log("Upload & Parse");
  const text =
    "Patient: Jane Roe\nDate: 2024-03-10\nDiagnosis: Diabetes\nMedication: Metformin 500mg twice daily";
  const up = await f(`${NODE_BASE.replace(/\/$/, "")}/api/upload-doc`, {
    method: "POST",
    headers,
    body: JSON.stringify({ text, filename: "sample.txt" }),
  });
  const upText = await up.text();
  console.log("Upload status", up.status, upText);

  console.log("Fetch docs");
  const docs = await f(`${NODE_BASE.replace(/\/$/, "")}/api/docs`, { headers });
  console.log("Docs status", docs.status, await docs.text());
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
