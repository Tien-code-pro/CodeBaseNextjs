import { access, mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import config from "../page-scaffold.config.mjs";

const projectRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  ".."
);
const importBlockStart = "// page:create imports:start";
const importBlockEnd = "// page:create imports:end";
const reducerBlockStart = "    // page:create reducers:start";
const reducerBlockEnd = "    // page:create reducers:end";
const textExtensions = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs"]);

function printUsage() {
  console.log(`Tạo hoặc bổ sung Next.js page từ template của dự án.

Usage:
  yarn page:create <route> [--default] [--redux] [--dry-run]

Ví dụ:
  yarn page:create gioi-thieu
  yarn page:create gioi-thieu --redux
  yarn page:create gioi-thieu --default
  yarn page:create gioi-thieu --default --redux
  yarn page:create gioi-thieu/[slug]
  yarn page:create gioi-thieu/[slug] --dry-run`);
}

function getTemplateType(args) {
  const typeFlags = args.filter(
    (arg) => arg.startsWith("--") && arg !== "--dry-run" && arg !== "--redux"
  );
  if (typeFlags.length > 1) {
    throw new Error("Chỉ được chọn một loại template.");
  }

  const templateType = typeFlags[0]?.slice(2) || "default";
  const templateRoot = config.templates?.[templateType];
  if (typeof templateRoot !== "string" || !templateRoot) {
    const availableTypes = Object.keys(config.templates || {}).map(
      (type) => `--${type}`
    );
    throw new Error(
      `Không có template --${templateType}. Có thể dùng: ${
        availableTypes.join(", ") || "(chưa cấu hình)"
      }.`
    );
  }

  return { templateType, templateRoot, isExplicit: typeFlags.length === 1 };
}

function getRouteSegments(route) {
  const normalizedRoute = route
    .trim()
    .replaceAll("\\", "/")
    .replace(/^\/+|\/+$/g, "");

  if (!normalizedRoute) {
    throw new Error("Route không được để trống.");
  }

  const segments = normalizedRoute.split("/");
  for (const segment of segments) {
    if (
      !segment ||
      segment === "." ||
      segment === ".." ||
      /[<>:"|?*]/.test(segment)
    ) {
      throw new Error(`Route không hợp lệ: ${route}`);
    }
  }

  return segments;
}

function isInside(parent, child) {
  const relativePath = path.relative(parent, child);
  return (
    relativePath &&
    !relativePath.startsWith("..") &&
    !path.isAbsolute(relativePath)
  );
}

function getLineEnding(content) {
  return content.includes("\r\n") ? "\r\n" : "\n";
}

function toWords(value) {
  return value
    .replace(/[\[\]().]/g, " ")
    .replace(/[-_]/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

function toTitle(routeSegments) {
  return routeSegments
    .flatMap(toWords)
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
}

function toSliceName(routeSegments) {
  const words = routeSegments.flatMap(toWords);
  const baseName = words
    .map((word, index) => {
      const lowerCaseWord = word.toLowerCase();
      return index === 0
        ? lowerCaseWord
        : lowerCaseWord[0].toUpperCase() + lowerCaseWord.slice(1);
    })
    .join("")
    .replace(/[^a-zA-Z0-9_$]/g, "");
  const safeName = /^[a-zA-Z_$]/.test(baseName) ? baseName : `page${baseName}`;

  return `${safeName || "page"}Slice`;
}

function escapeJsxText(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("{", "&#123;")
    .replaceAll("}", "&#125;");
}

function removeGeneratorComments(content) {
  return content
    .replace(/^[\t ]*\/\/\s*fix\s*(?:\r?\n|$)/gim, "")
    .replace(/^[\t ]*\/\/\s*title\s+động.*(?:\r?\n|$)/gim, "");
}

function isSliceTemplate(source, relativePath) {
  if (!textExtensions.has(path.extname(relativePath).toLowerCase())) {
    return false;
  }

  const content = source.toString("utf8");
  return (
    /\btitleSlice\b/.test(content) &&
    /createSlice\s*\(/.test(content) &&
    /name:\s*["']title["']/.test(content)
  );
}

function renderTemplateFile(source, relativePath, context, sliceTemplate) {
  if (!textExtensions.has(path.extname(relativePath).toLowerCase())) {
    return source;
  }

  let content = removeGeneratorComments(source.toString("utf8"));
  const baseName = path.basename(relativePath);

  if (baseName === "page.tsx") {
    const h3Pattern = /<h3(\s[^>]*)?>([\s\S]*?)<\/h3>/i;
    if (!h3Pattern.test(content)) {
      throw new Error(`Template ${relativePath} phải có thẻ <h3> đầu tiên.`);
    }
    content = content.replace(
      h3Pattern,
      (_, attributes = "") =>
        `<h3${attributes}>${escapeJsxText(context.title)}</h3>`
    );
  }

  if (sliceTemplate) {
    if (!content.includes("titleSlice")) {
      throw new Error(`Template ${relativePath} phải khai báo titleSlice.`);
    }
    if (!/name:\s*["']title["']/.test(content)) {
      throw new Error(`Template ${relativePath} phải có name: "title".`);
    }
    content = content
      .replace(/\btitleSlice\b/g, context.sliceName)
      .replace(/name:\s*["']title["']/, `name: "${context.sliceName}"`);
  }

  return Buffer.from(content, "utf8");
}

async function getTemplateFiles(directory, parent = "") {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries.sort((left, right) =>
    left.name.localeCompare(right.name)
  )) {
    const relativePath = path.join(parent, entry.name);
    const sourcePath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await getTemplateFiles(sourcePath, relativePath)));
      continue;
    }
    if (entry.isFile()) {
      files.push({ relativePath, sourcePath });
    }
  }

  return files;
}

async function getSliceTemplatePaths(templateFiles) {
  const sliceTemplatePaths = new Set();

  for (const templateFile of templateFiles) {
    const source = await readFile(templateFile.sourcePath);
    if (isSliceTemplate(source, templateFile.relativePath)) {
      sliceTemplatePaths.add(templateFile.relativePath);
    }
  }

  return sliceTemplatePaths;
}

async function fileExists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

function createEmptyRegistry() {
  return { version: 1, pages: {} };
}

async function readRegistry(registryPath) {
  if (!(await fileExists(registryPath))) {
    return createEmptyRegistry();
  }

  let parsedRegistry;
  try {
    parsedRegistry = JSON.parse(await readFile(registryPath, "utf8"));
  } catch {
    throw new Error(`Không đọc được ${config.registryFile}.`);
  }
  if (!parsedRegistry || typeof parsedRegistry.pages !== "object") {
    throw new Error(`${config.registryFile} phải có object pages.`);
  }

  return { version: 1, pages: parsedRegistry.pages };
}

async function removeDeletedRegistryPages(registry, routeRoot) {
  let changed = false;

  for (const route of Object.keys(registry.pages)) {
    let routeSegments;
    try {
      routeSegments = getRouteSegments(route);
    } catch {
      delete registry.pages[route];
      changed = true;
      continue;
    }

    const pageDirectory = path.resolve(routeRoot, ...routeSegments);
    if (
      !isInside(routeRoot, pageDirectory) ||
      !(await fileExists(pageDirectory))
    ) {
      delete registry.pages[route];
      changed = true;
    }
  }

  return changed;
}

async function writeRegistry(registryPath, registry) {
  const sortedPages = Object.fromEntries(
    Object.entries(registry.pages).sort(([left], [right]) =>
      left.localeCompare(right)
    )
  );
  await writeFile(
    registryPath,
    `${JSON.stringify({ version: 1, pages: sortedPages }, null, 2)}\n`,
    "utf8"
  );
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function insertIntoManagedBlock(content, startMarker, endMarker, line) {
  const endIndex = content.indexOf(endMarker);
  if (endIndex === -1) {
    throw new Error(`Thiếu marker ${endMarker} trong ${config.storeFile}.`);
  }
  return `${content.slice(0, endIndex)}${line}${getLineEnding(
    content
  )}${content.slice(endIndex)}`;
}

function registerSlice(storeContent, { sliceName, importPath }) {
  const lineEnding = getLineEnding(storeContent);
  const importLine = `import ${sliceName} from "${importPath}";`;
  const reducerLine = `    ${sliceName}: ${sliceName}.reducer,`;
  const importPattern = new RegExp(
    `^\\s*import\\s+${escapeRegExp(sliceName)}\\s+from\\s+["']${escapeRegExp(
      importPath
    )}["'];?\\s*$`,
    "m"
  );
  const reducerPattern = new RegExp(
    `^\\s*${escapeRegExp(sliceName)}\\s*:\\s*${escapeRegExp(
      sliceName
    )}\\.reducer,?\\s*$`,
    "m"
  );
  let nextContent = storeContent;

  if (
    !nextContent.includes(importBlockStart) &&
    nextContent.includes(importBlockEnd)
  ) {
    nextContent = nextContent.replace(
      importBlockEnd,
      `${importBlockStart}${lineEnding}${importBlockEnd}`
    );
  }

  if (!importPattern.test(nextContent)) {
    if (nextContent.includes(importBlockStart)) {
      nextContent = insertIntoManagedBlock(
        nextContent,
        importBlockStart,
        importBlockEnd,
        importLine
      );
    } else {
      const imports = [...nextContent.matchAll(/^import[^\r\n]+;\r?$/gm)];
      if (!imports.length) {
        throw new Error(
          `Không tìm thấy import để thêm slice vào ${config.storeFile}.`
        );
      }
      const lastImport = imports.at(-1);
      const insertionIndex = lastImport.index + lastImport[0].length;
      const block = `${lineEnding}${importBlockStart}${lineEnding}${importLine}${lineEnding}${importBlockEnd}`;
      nextContent = `${nextContent.slice(
        0,
        insertionIndex
      )}${block}${nextContent.slice(insertionIndex)}`;
    }
  }

  if (!reducerPattern.test(nextContent)) {
    if (nextContent.includes(reducerBlockStart)) {
      nextContent = insertIntoManagedBlock(
        nextContent,
        reducerBlockStart,
        reducerBlockEnd,
        reducerLine
      );
    } else {
      const reducerMatch = /reducer\s*:\s*\{\r?\n/.exec(nextContent);
      if (!reducerMatch || reducerMatch.index === undefined) {
        throw new Error(
          `Không tìm thấy reducer object trong ${config.storeFile}.`
        );
      }
      const insertionIndex = reducerMatch.index + reducerMatch[0].length;
      const block = `${reducerBlockStart}${lineEnding}${reducerLine}${lineEnding}${reducerBlockEnd}${lineEnding}`;
      nextContent = `${nextContent.slice(
        0,
        insertionIndex
      )}${block}${nextContent.slice(insertionIndex)}`;
    }
  }

  return nextContent;
}

async function createPage() {
  const args = process.argv.slice(2);
  if (args.includes("--help") || args.includes("-h")) {
    printUsage();
    return;
  }

  const dryRun = args.includes("--dry-run");
  const reduxWasRequested = args.includes("--redux");
  const route = args.find((arg) => !arg.startsWith("-"));
  if (!route) {
    printUsage();
    process.exitCode = 1;
    return;
  }

  const requestedTemplate = getTemplateType(args);
  const routeRoot = path.resolve(projectRoot, config.routeRoot);
  const registryPath = path.resolve(projectRoot, config.registryFile);
  const routeSegments = getRouteSegments(route);
  const registry = await readRegistry(registryPath);
  let registryChanged = await removeDeletedRegistryPages(registry, routeRoot);
  const requestedEntry = registry.pages[routeSegments.join("/")];
  const templateType =
    !requestedTemplate.isExplicit && requestedEntry?.template
      ? requestedEntry.template
      : requestedTemplate.templateType;
  const configuredTemplateRoot = config.templates?.[templateType];
  if (typeof configuredTemplateRoot !== "string" || !configuredTemplateRoot) {
    throw new Error(`Không có template --${templateType}.`);
  }
  const useRedux = reduxWasRequested || requestedEntry?.redux === true;
  const templateRoot = path.resolve(projectRoot, configuredTemplateRoot);
  const storePath = path.resolve(projectRoot, config.storeFile);
  if (
    !isInside(projectRoot, routeRoot) ||
    !isInside(projectRoot, templateRoot)
  ) {
    throw new Error("Cấu hình route/template phải nằm trong thư mục dự án.");
  }
  if (useRedux && !(await fileExists(storePath))) {
    throw new Error(`Không tìm thấy Redux store: ${config.storeFile}`);
  }

  const templateFiles = await getTemplateFiles(templateRoot);
  if (!templateFiles.length) {
    throw new Error(`Thư mục template trống: ${configuredTemplateRoot}`);
  }
  const sliceTemplatePaths = await getSliceTemplatePaths(templateFiles);
  if (useRedux && !sliceTemplatePaths.size) {
    throw new Error(
      `Template --${templateType} không có reduxSlice hợp lệ để dùng với --redux.`
    );
  }

  const pendingWrites = [];
  const sliceRegistrations = [];
  const results = [];

  for (let depth = 1; depth <= routeSegments.length; depth += 1) {
    const pageSegments = routeSegments.slice(0, depth);
    const pageDirectory = path.resolve(routeRoot, ...pageSegments);
    if (!isInside(routeRoot, pageDirectory)) {
      throw new Error("Route phải nằm trong routeRoot đã cấu hình.");
    }

    const context = {
      title: toTitle(pageSegments),
      sliceName: toSliceName(pageSegments),
    };
    const pageKey = pageSegments.join("/");
    const previousEntry = registry.pages[pageKey];
    const nextEntry = {
      template: requestedTemplate.isExplicit
        ? templateType
        : previousEntry?.template || templateType,
      redux: reduxWasRequested || previousEntry?.redux === true || useRedux,
    };
    if (JSON.stringify(previousEntry) !== JSON.stringify(nextEntry)) {
      registry.pages[pageKey] = nextEntry;
      registryChanged = true;
    }

    for (const templateFile of templateFiles) {
      const sliceTemplate = sliceTemplatePaths.has(templateFile.relativePath);
      if (sliceTemplate && !useRedux) {
        continue;
      }

      const destinationPath = path.resolve(
        pageDirectory,
        templateFile.relativePath
      );
      if (!isInside(pageDirectory, destinationPath)) {
        throw new Error(
          `File template không hợp lệ: ${templateFile.relativePath}`
        );
      }

      if (await fileExists(destinationPath)) {
        results.push({ destinationPath, status: "đã có" });
        continue;
      }

      const source = await readFile(templateFile.sourcePath);
      const content = renderTemplateFile(
        source,
        templateFile.relativePath,
        context,
        sliceTemplate
      );
      pendingWrites.push({ destinationPath, content });
      results.push({ destinationPath, status: dryRun ? "sẽ tạo" : "đã tạo" });

      if (sliceTemplate) {
        const aliasPath = path.posix.join(
          "@/app/(site)",
          ...pageSegments,
          templateFile.relativePath
            .split(path.sep)
            .join("/")
            .replace(/\.tsx$/, "")
        );
        sliceRegistrations.push({
          sliceName: context.sliceName,
          importPath: aliasPath,
        });
      }
    }
  }

  let storeContent = "";
  let storeChanged = false;
  if (useRedux) {
    storeContent = await readFile(storePath, "utf8");
    for (const registration of sliceRegistrations) {
      const nextStoreContent = registerSlice(storeContent, registration);
      if (nextStoreContent !== storeContent) {
        results.push({
          destinationPath: storePath,
          status: dryRun ? "sẽ đăng ký Redux" : "đã đăng ký Redux",
          sliceName: registration.sliceName,
        });
        storeContent = nextStoreContent;
        storeChanged = true;
      }
    }
  }

  if (!dryRun) {
    for (const { destinationPath, content } of pendingWrites) {
      await mkdir(path.dirname(destinationPath), { recursive: true });
      await writeFile(destinationPath, content);
    }
    if (storeChanged) {
      await writeFile(storePath, storeContent, "utf8");
    }
    if (registryChanged) {
      await writeRegistry(registryPath, registry);
    }
  }

  for (const { destinationPath, status, sliceName } of results) {
    const suffix = sliceName ? ` (${sliceName})` : "";
    console.log(
      `${status.padEnd(19)} [${templateType}] ${path.relative(
        projectRoot,
        destinationPath
      )}${suffix}`
    );
  }
  if (registryChanged) {
    console.log(
      `${dryRun ? "sẽ cập nhật" : "đã cập nhật"} registry ${
        config.registryFile
      }`
    );
  }
}

createPage().catch((error) => {
  console.error(`Không thể tạo page: ${error.message}`);
  process.exitCode = 1;
});
