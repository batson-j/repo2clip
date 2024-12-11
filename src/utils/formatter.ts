// src/utils/formatter.ts
import * as path from "path";
import { DirectoryResult, FileInfo } from "../types";
import { getConfiguration } from "../config/settings";
import ignore from "ignore";

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
    const relativePath = path.relative(basePath, file.path);
    const ig = ignore().add(config.alwaysIncluded);
    if (ig.ignores(relativePath)) {
      priorityFiles.push(file);
    } else {
      regularFiles.push(file);
    }
  });

  // Sort priority files: README.md first, then maintain config order
  priorityFiles.sort((a, b) => {
    const aPath = path.relative(basePath, a.path);
    const bPath = path.relative(basePath, b.path);

    // README.md always comes first
    if (aPath.toLowerCase().endsWith("readme.md")) {
      return -1;
    }
    if (bPath.toLowerCase().endsWith("readme.md")) {
      return 1;
    }

    // For other files, maintain the order from config
    const aMatchIndex = config.alwaysIncluded.findIndex((pattern) =>
      ignore().add(pattern).ignores(aPath)
    );
    const bMatchIndex = config.alwaysIncluded.findIndex((pattern) =>
      ignore().add(pattern).ignores(bPath)
    );
    return aMatchIndex - bMatchIndex;
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
