// src/utils/gitignore.ts
import * as fs from "fs";
import * as path from "path";
import ignore from "ignore";
import { DEFAULT_EXCLUDE_FILES, DEFAULT_EXCLUDE_DIRS } from "./constants";

export class GitignoreHandler {
  private ig: ReturnType<typeof ignore>;

  constructor(basePath: string) {
    this.ig = ignore();

    // Read .gitignore if it exists
    const gitignorePath = path.join(basePath, ".gitignore");
    if (fs.existsSync(gitignorePath)) {
      const gitignoreContent = fs.readFileSync(gitignorePath, "utf-8");
      this.ig.add(gitignoreContent);
    }

    // Add default ignore patterns
    this.ig.add([
      ...Array.from(DEFAULT_EXCLUDE_FILES),
      ...Array.from(DEFAULT_EXCLUDE_DIRS),
    ]);
  }

  isIgnored(filepath: string, basePath: string): boolean {
    const relativePath = path.relative(basePath, filepath).replace(/\\/g, "/");
    return this.ig.ignores(relativePath);
  }
}
