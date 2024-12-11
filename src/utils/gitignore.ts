// src/utils/gitignore.ts
import * as fs from "fs";
import * as path from "path";
import ignore from "ignore";
import * as vscode from "vscode";
import { getConfiguration } from "../config/settings";
import { IgnoreResult } from "../types";

export class GitignoreHandler {
  private gitignoreIg: ReturnType<typeof ignore>;
  private settingsIg: ReturnType<typeof ignore>;
  private includeIg: ReturnType<typeof ignore>;
  private hasConflicts: Set<string> = new Set();

  constructor(basePath: string) {
    const config = getConfiguration();

    // Initialize separate ignore instances
    this.gitignoreIg = ignore();
    this.settingsIg = ignore();
    this.includeIg = ignore();

    // Read .gitignore if it exists
    const gitignorePath = path.join(basePath, ".gitignore");
    if (fs.existsSync(gitignorePath)) {
      const gitignoreContent = fs.readFileSync(gitignorePath, "utf-8");
      this.gitignoreIg.add(gitignoreContent);
    }

    // Add configured patterns
    this.settingsIg.add(config.alwaysExcluded);
    this.includeIg.add(config.alwaysIncluded);
  }

  checkIgnoreStatus(filepath: string, basePath: string): IgnoreResult {
    const relativePath = path.relative(basePath, filepath).replace(/\\/g, "/");

    const isGitignored = this.gitignoreIg.ignores(relativePath);
    const isSettingsIgnored = this.settingsIg.ignores(relativePath);
    const isIncluded = this.includeIg.ignores(relativePath);

    // Check for conflicts
    if (isIncluded && (isGitignored || isSettingsIgnored)) {
      if (!this.hasConflicts.has(relativePath)) {
        this.hasConflicts.add(relativePath);
        vscode.window.showWarningMessage(
          `Conflict detected: "${relativePath}" is both included and excluded. Inclusion will take precedence.`
        );
      }
      return { isIgnored: false, source: "both" };
    }

    if (isGitignored && isSettingsIgnored) {
      return { isIgnored: true, source: "both" };
    }

    if (isGitignored) {
      return { isIgnored: true, source: "gitignore" };
    }

    if (isSettingsIgnored) {
      return { isIgnored: true, source: "settings" };
    }

    if (isIncluded) {
      return { isIgnored: false, source: "settings" };
    }

    return { isIgnored: false };
  }

  isIgnored(filepath: string, basePath: string): boolean {
    const { isIgnored, source } = this.checkIgnoreStatus(filepath, basePath);
    return isIgnored;
  }

  isIncluded(filepath: string, basePath: string): boolean {
    const relativePath = path.relative(basePath, filepath).replace(/\\/g, "/");
    return this.includeIg.ignores(relativePath);
  }
}
