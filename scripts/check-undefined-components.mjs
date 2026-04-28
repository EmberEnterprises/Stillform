#!/usr/bin/env node
// Catch undefined React component references — JSX <Foo /> against a Foo that
// isn't declared anywhere. esbuild parses these as valid (lowercase = HTML
// element, PascalCase = component reference resolved at runtime), so they only
// crash when the component is actually rendered. This is the bug class that
// shipped FocusCheckValidation, PanicMode, and FractalBreathCanvas as silent
// crashes — all three deleted in commit 571074ee7381 with calls left dangling.

import { readFileSync } from "node:fs";

const PATHS = ["src/App.jsx"];

// React/library components that aren't declared in App.jsx
const KNOWN_EXTERNAL = new Set([
  "React", "Fragment", "StrictMode", "Component", "Suspense",
  "Provider", "Consumer", "Context", "PureComponent",
  // App-internal class component declared via `class X extends Component`
  "ErrorBoundary",
]);

let failed = false;

for (const path of PATHS) {
  const content = readFileSync(path, "utf8");

  // Find every JSX usage of a PascalCase tag
  const usages = new Set();
  for (const match of content.matchAll(/<([A-Z][a-zA-Z0-9]*)(?:\s|\/>|>)/g)) {
    usages.add(match[1]);
  }

  // Find every declared identifier that could be a component
  // - function Foo(...
  // - const Foo = (... | function | memo(... etc.
  // - class Foo extends ...
  const declared = new Set();
  for (const match of content.matchAll(/(?:function|const|let|var|class)\s+([A-Z][a-zA-Z0-9]*)\b/g)) {
    declared.add(match[1]);
  }

  const missing = [...usages].filter(name =>
    !declared.has(name) && !KNOWN_EXTERNAL.has(name)
  );

  if (missing.length > 0) {
    failed = true;
    process.stderr.write(
      `\n✗ ${path}: undefined component reference(s): ${missing.join(", ")}\n` +
      `  These render as JSX but aren't declared anywhere. They will crash at runtime\n` +
      `  the moment they're rendered. Add the component or remove the reference.\n`
    );
  }
}

process.exit(failed ? 1 : 0);
