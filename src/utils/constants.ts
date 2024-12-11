// src/utils/constants.ts
import * as path from "path";

export const DEFAULT_EXCLUDE_FILES = new Set([
  // System files
  ".DS_Store",
  "Thumbs.db",
  "desktop.ini",

  // Lock files
  "package-lock.json",
  "yarn.lock",
  "pnpm-lock.yaml",
  "poetry.lock",
  "Gemfile.lock",
  "composer.lock",
  "cargo.lock",
  "mix.lock",

  // Environment and local config
  ".env.local",
  ".env.development.local",
  ".env.test.local",
  ".env.production.local",

  // IDE files
  ".idea",
  ".vscode",
  "*.swp",
  "*.swo",

  // Build artifacts
  "*.pyc",
  "*.pyo",
  "*.pyd",
  "*.so",
  "*.dll",
  "*.dylib",
  "*.class",
  "*.exe",
]);

export const DEFAULT_EXCLUDE_DIRS = new Set([
  "__pycache__",
  "node_modules",
  ".git",
  ".svn",
  ".hg",
  ".next",
  "dist",
  "build",
  "target",
  "out",
  "coverage",
  "venv",
  ".venv",
  "env",
  ".env",
]);

export function isAlwaysIncludedFile(
  filePath: string,
  config: string[]
): boolean {
  return config.includes(path.basename(filePath).toLowerCase());
}
