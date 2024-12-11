// src/config/settings.ts
import * as vscode from "vscode";
import { ExtensionConfig } from "../types";

export function getConfiguration(): ExtensionConfig {
  const config = vscode.workspace.getConfiguration("repo2clip");
  return {
    alwaysIncluded: config.get<string[]>("alwaysIncluded", [
      "readme.md",
      "package.json",
      "requirements.txt",
      "pyproject.toml",
      "cargo.toml",
      "go.mod",
      "gemfile",
      "composer.json",
      "build.gradle",
      "pom.xml",
    ]),
    alwaysExcluded: config.get<string[]>("alwaysExcluded", [
      // Build artifacts and binaries
      "**/*.pyc",
      "**/*.pyo",
      "**/*.pyd",
      "**/*.so",
      "**/*.dll",
      "**/*.dylib",
      "**/*.class",
      "**/*.exe",

      // System files
      "**/.DS_Store",
      "**/Thumbs.db",
      "**/desktop.ini",

      // Package manager files
      "**/package-lock.json",
      "**/yarn.lock",
      "**/pnpm-lock.yaml",
      "**/*.lock",

      // Environment and configuration
      "**/.env.*",
      "**/.idea/**",
      "**/.vscode/**",
      "**/*.swp",
      "**/*.swo",

      // Dependencies and build directories
      "**/node_modules/**",
      "**/__pycache__/**",
      "**/.git/**",
      "**/.svn/**",
      "**/.hg/**",
      "**/.next/**",
      "**/dist/**",
      "**/build/**",
      "**/target/**",
      "**/out/**",
      "**/coverage/**",
      "**/venv/**",
      "**/.venv/**",
      "**/env/**",
      "**/.env/**",
    ]),
    maxFileSize: config.get<number>("maxFileSize", 1000000),
  };
}
