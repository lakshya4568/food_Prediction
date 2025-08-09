#!/usr/bin/env node
/*
 Simple smoke tests for local dev:
 - Flask: GET /health, POST /ocr-extract (optional file)
 - Node: register temp user, login, GET /api/docs, POST /api/upload-doc with sample text
 Usage:
   node scripts/smoke-test.js [path/to/sample.pdf|image]
*/

const fs = require("fs");
const path = require("path");

const NODE_BASE =
  process.env.NODE_BASE ||
  process.env.NEXT_PUBLIC_NODE_API_BASE ||
  "http://localhost:3001";
const FLASK_BASE =
  process.env.FLASK_BASE ||
  process.env.NEXT_PUBLIC_FLASK_API_BASE ||
  "http://localhost:5001";

async function main() {
  const f = global.fetch || (await import("node-fetch")).default;

  console.log("== Flask /health ==");
  const h = await f(`${FLASK_BASE.replace(/\/$/, "")}/health`);
  console.log("Status", h.status, "Body", await h.text());

  const samplePath = process.argv[2];
  if (samplePath && fs.existsSync(samplePath)) {
    console.log("== Flask /ocr-extract ==");
    let fd;
    let headers = {};
    if (typeof FormData !== "undefined") {
      // Node 18+ (undici)
      fd = new FormData();
      fd.append(
        "file",
        new Blob([fs.readFileSync(samplePath)]),
        path.basename(samplePath)
      );
    } else {
      // Fallback to form-data package
      const FD = require("form-data");
      fd = new FD();
      fd.append("file", fs.createReadStream(samplePath));
      headers = fd.getHeaders();
    }
    const o = await f(`${FLASK_BASE.replace(/\/$/, "")}/ocr-extract`, {
      method: "POST",
      body: fd,
      headers,
    });
    console.log("Status", o.status, "Body", await o.text());
  }

  // Node register/login
  const email = `test_${Date.now()}@local.dev`;
  const password = "test1234";
  console.log("== Node register ==");
  await f(`${NODE_BASE.replace(/\/$/, "")}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ firstName: "T", lastName: "U", email, password }),
  }).catch(() => {});

  console.log("== Node login ==");
  const login = await f(`${NODE_BASE.replace(/\/$/, "")}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    redirect: "manual",
  });
  const setCookie = login.headers.get("set-cookie") || "";
  console.log("Login status", login.status);

  const headers = { "Content-Type": "application/json", Cookie: setCookie };
  console.log("== Node /api/docs ==");
  const docs = await f(`${NODE_BASE.replace(/\/$/, "")}/api/docs`, { headers });
  console.log("Status", docs.status, "Body", await docs.text());

  console.log("== Node /api/upload-doc ==");
  const sampleText =
    "Patient: John Doe\nDate: 2024-01-01\nDiagnosis: Hypertension\nMedication: Lisinopril 10mg daily";
  const up = await f(`${NODE_BASE.replace(/\/$/, "")}/api/upload-doc`, {
    method: "POST",
    headers,
    body: JSON.stringify({ text: sampleText, filename: "sample.txt" }),
  });
  console.log("Status", up.status, "Body", await up.text());
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
