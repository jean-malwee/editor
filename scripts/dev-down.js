const { execSync } = require("child_process");

function run(command, options = {}) {
  console.log(`\n> ${command}`);
  execSync(command, { stdio: "inherit", shell: true, ...options });
}

try {
  console.log("🔄 Derrubando containers...");
  run("docker compose down");
} catch (error) {
  console.error("❌ Ocorreu um erro:", error.message);
  process.exit(1);
}