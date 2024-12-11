// src/utils/fileSystem.ts
import * as fs from "fs";
import * as path from "path";
import * as vscode from "vscode";
import { GitignoreHandler } from "./gitignore";
import { DEFAULT_EXCLUDE_DIRS, DEFAULT_EXCLUDE_FILES } from "./constants";
import { DirectoryResult, FileInfo, ProcessingOptions } from "../types";
import { getConfiguration } from "../config/settings";

export function shouldExclude(
  filepath: string,
  gitignoreHandler: GitignoreHandler,
  basePath: string
): boolean {
  const name = path.basename(filepath);
  const isDirectory = fs.statSync(filepath).isDirectory();

  // Check if it's in our default exclude lists
  if (isDirectory && DEFAULT_EXCLUDE_DIRS.has(name)) {
    return true;
  }

  if (!isDirectory) {
    // Check exact matches
    if (DEFAULT_EXCLUDE_FILES.has(name)) {
      return true;
    }

    // Check pattern matches (like *.pyc)
    for (const pattern of DEFAULT_EXCLUDE_FILES) {
      if (pattern.includes("*")) {
        const regex = new RegExp(
          "^" + pattern.replace(/\./g, "\\.").replace(/\*/g, ".*") + "$",
          "i"
        );
        if (regex.test(name)) {
          return true;
        }
      }
    }
  }

  // Check gitignore patterns
  return gitignoreHandler.isIgnored(filepath, basePath);
}

export function getDirectoryStructure(
  startPath: string,
  options: ProcessingOptions
): DirectoryResult {
  let output = "\nDirectory Structure:\n===================\n";
  const files: FileInfo[] = [];
  const gitignoreHandler = new GitignoreHandler(startPath);
  const config = getConfiguration();

  function processDirectory(currentPath: string, level: number = 0): void {
    const items = fs.readdirSync(currentPath);
    const indent = "│   ".repeat(level);

    // Filter and sort directories and files
    const dirs = items
      .filter((item) => {
        const fullPath = path.join(currentPath, item);
        try {
          return (
            fs.statSync(fullPath).isDirectory() &&
            !shouldExclude(fullPath, gitignoreHandler, startPath)
          );
        } catch (error) {
          return false;
        }
      })
      .sort();

    const fileItems = items
      .filter((item) => {
        const fullPath = path.join(currentPath, item);
        try {
          return (
            fs.statSync(fullPath).isFile() &&
            !shouldExclude(fullPath, gitignoreHandler, startPath)
          );
        } catch (error) {
          return false;
        }
      })
      .sort();

    if (level === 0) {
      output += `📁 ${path.basename(currentPath)}\n`;
    }

    // Process directories
    dirs.forEach((dir, index) => {
      const isLast = index === dirs.length - 1 && fileItems.length === 0;
      const prefix = isLast ? "└──" : "├──";
      output += `${indent}${prefix} 📁 ${dir}\n`;
      processDirectory(path.join(currentPath, dir), level + 1);
    });

    // Process files
    fileItems.forEach((file, index) => {
      const isLast = index === fileItems.length - 1;
      const prefix = isLast ? "└──" : "├──";
      output += `${indent}${prefix} 📄 ${file}\n`;

      // Only include file contents if specified in options
      if (options.includeContents) {
        const shouldIncludeContent =
          // Include if it's in the target directory (if specified)
          !options.targetDirectory ||
          currentPath.startsWith(options.targetDirectory) ||
          // Or if it's in the always included files list
          config.alwaysIncludedFiles.includes(file.toLowerCase());

        if (shouldIncludeContent) {
          try {
            const filePath = path.join(currentPath, file);
            const stats = fs.statSync(filePath);
            if (stats.size <= config.maxFileSize) {
              const content = fs.readFileSync(filePath, "utf-8");
              files.push({
                path: filePath,
                content: content,
              });
            }
          } catch (error) {
            console.error(`Error reading file ${file}:`, error);
          }
        }
      }
    });
  }

  processDirectory(startPath);
  return { structure: output, files };
}

export function getWorkspaceRoot(): string {
  const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
  if (!workspaceFolder) {
    throw new Error("No workspace folder open");
  }
  return workspaceFolder.uri.fsPath;
}

export function validatePath(uri?: vscode.Uri): string {
  if (uri) {
    return uri.fsPath;
  }
  return getWorkspaceRoot();
}
