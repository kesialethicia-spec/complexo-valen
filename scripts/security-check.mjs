#!/usr/bin/env node
/**
 * Static security checks for Supabase migrations.
 *
 * Scans every SQL file under supabase/migrations and the cumulative state
 * they describe, looking for common regressions:
 *
 *   1. CREATE TABLE in `public` without a matching ENABLE ROW LEVEL SECURITY.
 *   2. CREATE TABLE in `public` without any GRANT to authenticated / anon /
 *      service_role (PostgREST would 401 anyway, but this also catches
 *      tables that ship without explicit role grants).
 *   3. SECURITY DEFINER functions missing `SET search_path`.
 *   4. SECURITY DEFINER functions in `public` schema without an explicit
 *      `REVOKE ... FROM PUBLIC` / `FROM authenticated` — those become
 *      callable by any anon/authenticated user via PostgREST RPC.
 *   5. Permissive policies `USING (true)` on tables that look user-owned
 *      (have a `user_id` column anywhere in the migration history).
 *
 * Exits non-zero when any finding is reported. Designed to run in CI before
 * deploy.
 */

import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const MIGRATIONS_DIR = "supabase/migrations";

const files = readdirSync(MIGRATIONS_DIR)
  .filter((f) => f.endsWith(".sql"))
  .sort();

const sqlByFile = new Map();
for (const f of files) {
  sqlByFile.set(f, readFileSync(join(MIGRATIONS_DIR, f), "utf8"));
}
const allSql = [...sqlByFile.values()].join("\n");

const findings = [];
const report = (file, rule, message) =>
  findings.push({ file, rule, message });

// Strip line + block comments for matching, keep originals for messages.
const stripComments = (sql) =>
  sql
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/--[^\n]*/g, "");

// ---------- 1 & 2: public tables RLS + GRANT ----------
const tableRe =
  /create\s+table\s+(?:if\s+not\s+exists\s+)?(?:public\.)?"?([a-z_][a-z0-9_]*)"?/gi;

const publicTables = new Set();
for (const [file, sql] of sqlByFile) {
  const clean = stripComments(sql);
  let m;
  while ((m = tableRe.exec(clean))) {
    const name = m[1].toLowerCase();
    // ignore obvious non-public tables (those qualified with another schema)
    const prefix = clean.slice(Math.max(0, m.index - 40), m.index + m[0].length);
    if (/\b(auth|storage|realtime|private)\.\b/i.test(prefix)) continue;
    publicTables.add(name);

    const fileClean = stripComments(sql);
    const rlsRe = new RegExp(
      `alter\\s+table\\s+(?:public\\.)?"?${name}"?\\s+enable\\s+row\\s+level\\s+security`,
      "i",
    );
    const grantRe = new RegExp(
      `grant\\s+[^;]+\\s+on\\s+(?:table\\s+)?(?:public\\.)?"?${name}"?\\s+to\\s+`,
      "i",
    );
    if (!rlsRe.test(fileClean) && !new RegExp(rlsRe.source, "i").test(stripComments(allSql))) {
      report(file, "rls-missing", `public.${name} is created without ENABLE ROW LEVEL SECURITY`);
    }
    if (!grantRe.test(fileClean) && !new RegExp(grantRe.source, "i").test(stripComments(allSql))) {
      report(file, "grants-missing", `public.${name} is created without any GRANT to a role`);
    }
  }
}

// ---------- 3 & 4: SECURITY DEFINER hardening ----------
const fnRe =
  /create\s+(?:or\s+replace\s+)?function\s+([a-z_][\w]*)\.([a-z_][\w]*)\s*\([\s\S]*?\$function\$|create\s+(?:or\s+replace\s+)?function\s+([a-z_][\w]*)\.([a-z_][\w]*)\s*\([\s\S]*?\$\$/gi;

for (const [file, sql] of sqlByFile) {
  const clean = stripComments(sql);
  // simpler: scan for each `create function`, then look at the body until language line
  const blocks = clean.split(/create\s+(?:or\s+replace\s+)?function\s+/i).slice(1);
  for (const block of blocks) {
    const head = block.split(/\$\$|\$function\$/)[0] ?? "";
    const sigMatch = head.match(/^([a-z_][\w]*)?\.?([a-z_][\w]*)\s*\(/i);
    if (!sigMatch) continue;
    const schema = (sigMatch[1] || "public").toLowerCase();
    const name = sigMatch[2].toLowerCase();
    const isDefiner = /security\s+definer/i.test(head);
    if (!isDefiner) continue;

    if (!/set\s+search_path\s*=/i.test(head)) {
      report(file, "definer-search-path",
        `${schema}.${name} is SECURITY DEFINER without SET search_path`);
    }

    if (schema === "public") {
      // require an explicit REVOKE EXECUTE somewhere in history
      const revokeRe = new RegExp(
        `revoke\\s+(?:all|execute)[^;]*on\\s+function\\s+(?:public\\.)?${name}\\s*\\(`,
        "i",
      );
      if (!revokeRe.test(stripComments(allSql))) {
        report(file, "definer-executable",
          `public.${name} is SECURITY DEFINER and executable by PostgREST roles (add REVOKE EXECUTE ... FROM anon, authenticated or move to a private schema)`);
      }
    }
  }
}

// ---------- 5: USING (true) on user-owned tables ----------
const userOwned = new Set();
for (const sql of sqlByFile.values()) {
  const clean = stripComments(sql);
  const colRe = /create\s+table\s+(?:if\s+not\s+exists\s+)?(?:public\.)?"?([a-z_][\w]*)"?\s*\(([\s\S]*?)\)\s*;/gi;
  let m;
  while ((m = colRe.exec(clean))) {
    if (/\buser_id\b/i.test(m[2])) userOwned.add(m[1].toLowerCase());
  }
}
for (const [file, sql] of sqlByFile) {
  const clean = stripComments(sql);
  const polRe =
    /create\s+policy[^;]+on\s+(?:public\.)?"?([a-z_][\w]*)"?[\s\S]*?using\s*\(\s*true\s*\)/gi;
  let m;
  while ((m = polRe.exec(clean))) {
    const t = m[1].toLowerCase();
    if (userOwned.has(t)) {
      report(file, "permissive-policy",
        `permissive USING (true) policy on user-owned table public.${t}`);
    }
  }
}

// ---------- output ----------
if (findings.length === 0) {
  console.log(`✓ security-check: no findings across ${files.length} migrations`);
  process.exit(0);
}

console.error(`✗ security-check: ${findings.length} finding(s)\n`);
for (const f of findings) {
  console.error(`  [${f.rule}] ${f.file}\n    ${f.message}`);
}
process.exit(1);
