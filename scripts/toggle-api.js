// scripts/toggle-api.cjs
const fs = require("fs");
const path = require("path");

const [srcArg, destArg] = process.argv.slice(2);
const from = path.resolve(srcArg);
const to = path.resolve(destArg);

function moveDir(fromPath, toPath) {
  if (!fs.existsSync(fromPath)) {
    console.log(`⚠️  Skip: not found ${fromPath}`);
    return;
  }
  // if destination exists, remove it (so rename won't fail)
  if (fs.existsSync(toPath)) {
    fs.rmSync(toPath, { recursive: true, force: true });
  }
  fs.renameSync(fromPath, toPath);
  console.log(`✅ Moved ${fromPath} → ${toPath}`);
}

try {
  moveDir(from, to);
} catch (err) {
  console.error(`❌ Failed to move ${from} → ${to}:`, err.message);
  process.exit(1);
}
