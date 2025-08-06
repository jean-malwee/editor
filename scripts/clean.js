const fs = require("fs");
const path = require("path");

function deleteDirsIn(subPath, dirNames) {
  const absPath = path.join(process.cwd(), subPath);
  if (!fs.existsSync(absPath)) return;

  const entries = fs.readdirSync(absPath, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.isDirectory()) {
      const folderPath = path.join(absPath, entry.name);
      for (const dirName of dirNames) {
        const target = path.join(folderPath, dirName);
        if (fs.existsSync(target)) {
          console.log(`🧹 Deletando: ${target}`);
          fs.rmSync(target, { recursive: true, force: true });
        }
      }
    }
  }
}

try {
  console.log("🧼 Limpando node_modules e dist...");

  deleteDirsIn("apps", ["node_modules", "dist"]);
  deleteDirsIn("packages", ["node_modules", "dist"]);

  console.log("✅ Limpeza concluída.");
} catch (err) {
  console.error("❌ Erro durante a limpeza:", err.message);
  process.exit(1);
}