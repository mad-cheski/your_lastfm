require("dotenv").config();
const { sync } = require("./sync");
const db = require("./db");

const row = db.prepare("SELECT COUNT(*) as count FROM scrobbles").get();

if (row.count > 0) {
  console.log("ℹ️ Database already has data, skipping initial sync");
  process.exit(0);
}

(async () => {
  console.log("🚀 Running FULL initial sync...");
  await sync({ full: true });
  console.log("✅ Initial sync finished");
  process.exit(0);
})();
