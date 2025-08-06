const { execSync } = require("child_process");

function run(command, options = {}) {
  console.log(`\n> ${command}`);
  execSync(command, { stdio: "inherit", shell: true, ...options });
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

(async () => {
  try {
    console.log("🔄 Subindo containers...");
    run("docker compose up -d");

    console.log("📦 Fazendo build do mock");
    run("turbo run build --filter=@repo/database");

    console.log("📤 Aplicando migrations...");
    process.chdir("./packages/database");
    run("pnpm db:generate");
    run("pnpm db:deploy");

    console.log("🫛 Aplicando seed...");
    run("pnpm db:seed");
    process.chdir("../../");

    // console.log("⏳ Aguardando 2 segundos para garantir o build...");
    // await sleep(2000); // espera 2 segundos

    console.log("🚀 Iniciando Turbo Dev...");
    run("turbo run dev");
  } catch (error) {
    console.error("❌ Ocorreu um erro:", error.message);
    process.exit(1);
  }
})();