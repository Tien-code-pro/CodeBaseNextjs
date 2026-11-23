import { access, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import config from "../page-scaffold.config.mjs";

const projectRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  ".."
);

function getRouteSegments(route) {
  const normalizedRoute = route.replace(/^\/+|\/+$/g, "");
  if (!normalizedRoute) throw new Error(`Route không hợp lệ: ${route}`);
  return normalizedRoute.split("/");
}

async function exists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

function runCreate(args) {
  return new Promise((resolve) => {
    const child = spawn(
      process.execPath,
      ["scripts/create-page.mjs", ...args],
      {
        cwd: projectRoot,
        stdio: "inherit",
      }
    );
    child.once("exit", (code) => resolve(code ?? 1));
  });
}

async function syncPages() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  if (args.some((arg) => arg !== "--dry-run")) {
    throw new Error("Usage: yarn page:sync [--dry-run]");
  }

  const registryPath = path.resolve(projectRoot, config.registryFile);
  if (!(await exists(registryPath))) {
    console.log(`${config.registryFile} chưa tồn tại; không có page để sync.`);
    return;
  }

  const registry = JSON.parse(await readFile(registryPath, "utf8"));
  if (!registry || typeof registry.pages !== "object") {
    throw new Error(`${config.registryFile} phải có object pages.`);
  }

  const routeRoot = path.resolve(projectRoot, config.routeRoot);
  let changed = false;
  for (const route of Object.keys(registry.pages)) {
    const pageDirectory = path.resolve(routeRoot, ...getRouteSegments(route));
    if (!(await exists(pageDirectory))) {
      delete registry.pages[route];
      changed = true;
      console.log(`${dryRun ? "sẽ xóa" : "đã xóa"} registry ${route}`);
    }
  }

  if (changed && !dryRun) {
    await writeFile(
      registryPath,
      `${JSON.stringify(registry, null, 2)}\n`,
      "utf8"
    );
  }

  let failed = false;
  const pages = Object.entries(registry.pages).sort(
    ([left], [right]) =>
      left.split("/").length - right.split("/").length ||
      left.localeCompare(right)
  );
  for (const [route, page] of pages) {
    const createArgs = [route, `--${page.template}`];
    if (page.redux) createArgs.push("--redux");
    if (dryRun) createArgs.push("--dry-run");
    console.log(`Sync ${route}`);
    if ((await runCreate(createArgs)) !== 0) failed = true;
  }

  if (failed) process.exitCode = 1;
}

syncPages().catch((error) => {
  console.error(`Không thể sync page: ${error.message}`);
  process.exitCode = 1;
});
