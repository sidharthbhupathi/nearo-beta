/**
 * Extracts Tailwind class candidates from source files and writes
 * src/tailwind.safelist.css so Tailwind v4 generates ALL utilities.
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const srcDir = join(root, "src");

function walk(dir, files = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, files);
    else if (/\.(tsx|ts|jsx|js)$/.test(entry)) files.push(full);
  }
  return files;
}

function extractClasses(content) {
  const found = new Set();

  const patterns = [
    /className="([^"]+)"/g,
    /className='([^']+)'/g,
    /className=\{`([^`]+)`\}/g,
    /className=\{cn\(([\s\S]*?)\)\}/g,
  ];

  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(content))) {
      const chunk = match[1];
      const strings = chunk.match(/["'`]([^"'`]+)["'`]/g) || [chunk];
      for (const raw of strings) {
        const cleaned = raw.replace(/^["'`]|["'`]$/g, "");
        for (const token of cleaned.split(/\s+/)) {
          const cls = token.replace(/^cn\(|\),?$/g, "").trim();
          if (isValidClass(cls)) found.add(cls);
        }
      }
    }
  }

  return found;
}

function isValidClass(cls) {
  if (!cls || cls.length > 80) return false;
  if (cls.includes("${") || cls.includes("?") || cls.includes("(")) return false;
  if (/^[&>|]/.test(cls)) return false;
  return /^[@a-zA-Z0-9_!:/.\[\]%-]+$/.test(cls);
}

const EXTRA_CLASSES = [
  "bg-gradient-to-br", "bg-gradient-to-r", "bg-gradient-to-b",
  "from-brand-gold", "from-brand-primary", "from-brand-beige/40",
  "via-transparent", "via-brand-gold", "via-brand-gold/40", "via-brand-gold/50",
  "to-brand-gold/5", "to-brand-gold/20", "to-[#b8924f]", "to-[#2a2a2a]",
  "via-[#c4a066]", "to-transparent", "from-transparent",
  "scale-x-0", "scale-x-100", "group-hover:scale-x-100", "origin-left",
  "z-[1]", "top-[4.5rem]",
  "hover:from-brand-gold/20", "hover:to-brand-gold/5",
  "group-hover:from-brand-gold", "group-hover:to-[#b8924f]",
  "order-1", "order-2", "lg:order-1", "lg:order-2", "lg:col-span-2", "lg:col-span-3", "lg:col-span-5",
  "nav-tab-active", "panel-card", "page-shell", "focus:shadow-md",
  "hover:from-brand-primary", "hover:to-[#2d2d2d]", "hover:text-white",
  "from-brand-gold", "to-[#b8924f]", "to-[#2d2d2d]",
];

const all = new Set(EXTRA_CLASSES);
for (const file of walk(srcDir)) {
  for (const cls of extractClasses(readFileSync(file, "utf8"))) {
    all.add(cls);
  }
}

const sorted = [...all].sort();
const outPath = join(srcDir, "tailwind.safelist.css");
const body = `/* Auto-generated — run: node scripts/generate-tailwind-safelist.mjs */\n@source inline("${sorted.join(" ")}");\n`;

writeFileSync(outPath, body, "utf8");
console.log(`Wrote ${sorted.length} classes to src/tailwind.safelist.css`);
