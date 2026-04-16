import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

const collectFiles = (targetPath) => {
  const resolved = path.resolve(targetPath);
  if (!existsSync(resolved)) return [];

  const stats = statSync(resolved);
  if (stats.isFile()) return [resolved];
  if (!stats.isDirectory()) return [];

  const files = [];
  for (const entry of readdirSync(resolved, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name === ".git") continue;
    const nextPath = path.join(resolved, entry.name);
    if (entry.isDirectory()) {
      files.push(...collectFiles(nextPath));
      continue;
    }
    if (entry.isFile()) files.push(nextPath);
  }
  return files;
};

const parseRgArgs = (args = []) => {
  const normalizedArgs = Array.isArray(args) ? [...args] : [];
  if (normalizedArgs[0] === "-n") normalizedArgs.shift();
  const [pattern = "", ...inputs] = normalizedArgs;
  return {
    pattern,
    inputs: inputs.length ? inputs : ["."]
  };
};

const formatMatch = ({ file, lineNumber, lineContent }, { multipleInputs }) => {
  const relPath = path.relative(process.cwd(), file) || file;
  const prefix = multipleInputs ? `${relPath}:${lineNumber}` : `${lineNumber}`;
  return `${prefix}:${lineContent}`;
};

export const runPortableRipgrep = (args = []) => {
  const { pattern, inputs } = parseRgArgs(args);
  const regex = new RegExp(pattern);
  const files = [...new Set(inputs.flatMap((input) => collectFiles(input)))];
  const matches = [];

  for (const file of files) {
    let contents = "";
    try {
      contents = readFileSync(file, "utf8");
    } catch {
      continue;
    }

    const lines = contents.split(/\r?\n/);
    for (let index = 0; index < lines.length; index += 1) {
      const lineContent = lines[index];
      regex.lastIndex = 0;
      if (!regex.test(lineContent)) continue;
      matches.push({
        file,
        lineNumber: index + 1,
        lineContent
      });
    }
  }

  if (matches.length) {
    const multipleInputs = files.length > 1 || inputs.length > 1;
    matches.forEach((match) => {
      process.stdout.write(`${formatMatch(match, { multipleInputs })}\n`);
    });
  }

  return { status: matches.length > 0 ? 0 : 1 };
};
