#!/usr/bin/env node
/**
 * Smoke test for Nearo beta deployment.
 * Usage: node scripts/smoke-test.mjs [baseUrl]
 * Default: https://nearo-beta.onrender.com
 */

const BASE = process.argv[2] || process.env.APP_URL || "https://nearo-beta.onrender.com";
const TIMEOUT_MS = 90_000;

async function fetchWithTimeout(url, options = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

function pass(msg) {
  console.log(`  ✓ ${msg}`);
}

function fail(msg) {
  console.error(`  ✗ ${msg}`);
}

async function main() {
  console.log(`\nNearo beta smoke test → ${BASE}\n`);
  let errors = 0;

  // 1. Homepage
  try {
    const res = await fetchWithTimeout(`${BASE}/`);
    const html = await res.text();
    if (res.status !== 200) {
      fail(`GET / returned ${res.status}`);
      errors++;
    } else if (!html.includes("Nearo") || !html.includes("index-")) {
      fail("GET / missing expected Nearo SPA shell");
      errors++;
    } else {
      pass("Homepage loads (200, SPA shell)");
    }

    const jsMatch = html.match(/src="(\/assets\/[^"]+\.js)"/);
    const cssMatch = html.match(/href="(\/assets\/[^"]+\.css)"/);
    if (!jsMatch || !cssMatch) {
      fail("Homepage missing asset references");
      errors++;
    } else {
      const jsRes = await fetchWithTimeout(`${BASE}${jsMatch[1]}`);
      const cssRes = await fetchWithTimeout(`${BASE}${cssMatch[1]}`);
      if (jsRes.status !== 200) {
        fail(`JS bundle ${jsMatch[1]} → ${jsRes.status}`);
        errors++;
      } else {
        pass(`JS bundle loads (${jsMatch[1]})`);
      }
      if (cssRes.status !== 200) {
        fail(`CSS bundle ${cssMatch[1]} → ${cssRes.status}`);
        errors++;
      } else {
        pass(`CSS bundle loads (${cssMatch[1]})`);
      }
    }

    if (html.includes("4.9/5 Rating")) {
      fail('Homepage still contains dishonest "4.9/5 Rating" — redeploy latest build');
      errors++;
    } else {
      pass("No platform-level 4.9 rating in HTML shell");
    }
  } catch (e) {
    fail(`Homepage: ${e.message}`);
    errors++;
  }

  // 2. Health API
  try {
    const res = await fetchWithTimeout(`${BASE}/api/status/health`);
    const body = await res.json();
    if (res.status !== 200 || body.status !== "healthy") {
      fail(`Health check failed: ${res.status} ${JSON.stringify(body)}`);
      errors++;
    } else {
      pass(`API health OK (${body.platforms?.length ?? 0} platforms listed)`);
    }
  } catch (e) {
    fail(`Health API: ${e.message}`);
    errors++;
  }

  // 3. SPA fallback should not break API
  try {
    const res = await fetchWithTimeout(`${BASE}/api/status/health`, { method: "GET" });
    const ct = res.headers.get("content-type") || "";
    if (!ct.includes("application/json")) {
      fail(`Health endpoint content-type unexpected: ${ct}`);
      errors++;
    } else {
      pass("API returns JSON (not SPA fallback HTML)");
    }
  } catch (e) {
    fail(`API content-type: ${e.message}`);
    errors++;
  }

  console.log("");
  if (errors > 0) {
    console.error(`FAILED — ${errors} check(s) failed.\n`);
    process.exit(1);
  }
  console.log("PASSED — all smoke checks OK.\n");
  console.log("Manual checks still needed:");
  console.log("  • Waitlist form → Firestore waitlist collection");
  console.log("  • Google sign-in on production domain");
  console.log("  • Unverified login → pending gate on Dashboard");
  console.log("  • Verified merchant_accounts doc → live dashboard\n");
}

main();
