// src/utils/formatter.ts
import * as path from "path";
import { DirectoryResult, FileInfo } from "../types";
import { getConfiguration } from "../config/settings";

export function formatOutput(
  result: DirectoryResult,
  basePath: string
): string {
  let output = "";
  const config = getConfiguration();

  // Sort files into priority and non-priority
  const priorityFiles: FileInfo[] = [];
  const regularFiles: FileInfo[] = [];

  result.files.forEach((file) => {
    if (
      config.alwaysIncludedFiles.includes(
        path.basename(file.path).toLowerCase()
      )
    ) {
      priorityFiles.push(file);
    } else {
      regularFiles.push(file);
    }
  });

  // Sort priority files to ensure README.md is first
  priorityFiles.sort((a, b) => {
    const aName = path.basename(a.path).toLowerCase();
    const bName = path.basename(b.path).toLowerCase();
    if (aName === "readme.md") {
      return -1;
    }
    if (bName === "readme.md") {
      return 1;
    }
    return aName.localeCompare(bName);
  });

  // Add priority files
  priorityFiles.forEach((file) => {
    const relativePath = path.relative(basePath, file.path);
    output += `\`\`\`${relativePath}\n`;
    output += file.content;
    output += "\n```\n\n";
  });

  // Add directory structure
  output += result.structure + "\n";

  // Add remaining files
  regularFiles.forEach((file) => {
    const relativePath = path.relative(basePath, file.path);
    output += `\`\`\`${relativePath}\n`;
    output += file.content;
    output += "\n```\n\n";
  });

  return output;
}
