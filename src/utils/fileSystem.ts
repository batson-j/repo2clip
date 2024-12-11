// src/utils/fileSystem.ts
import * as fs from "fs";
import * as path from "path";
import * as vscode from "vscode";
import { GitignoreHandler } from "./gitignore";
import { DirectoryResult, FileInfo, ProcessingOptions } from "../types";
import { getConfiguration } from "../config/settings";

export function shouldExclude(
  filepath: string,
  gitignoreHandler: GitignoreHandler,
  basePath: string
): boolean {
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

      if (options.includeContents) {
        const filePath = path.join(currentPath, file);
        const shouldIncludeContent =
          !options.targetDirectory ||
          currentPath.startsWith(options.targetDirectory) ||
          gitignoreHandler.isIncluded(filePath, startPath);

        if (shouldIncludeContent) {
          try {
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
