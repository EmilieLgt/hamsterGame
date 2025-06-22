// scripts/generate-env.js
const fs = require("fs");
const path = require("path");

const outputFile = path.join(
  __dirname,
  "../src/environments/environment.prod.ts"
);

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error(
    "❌ Missing environment variables SUPABASE_URL or SUPABASE_KEY"
  );
  process.exit(1);
}

const fileContent = `
export const environment = {
  production: true,
  supabaseUrl: '${supabaseUrl}',
  supabaseKey: '${supabaseKey}',
};
`;

fs.writeFileSync(outputFile, fileContent.trim() + "\n");
console.log("✅ environment.prod.ts generated successfully");
