// src/types/index.ts
export interface FileInfo {
  path: string;
  content: string;
}

export interface DirectoryResult {
  structure: string;
  files: FileInfo[];
}

export interface ProcessingOptions {
  includeContents: boolean;
  targetDirectory?: string;
  maxFileSize?: number;
}

export interface ExtensionConfig {
  alwaysIncluded: string[];
  alwaysExcluded: string[];
  maxFileSize: number;
}

export interface IgnoreResult {
  isIgnored: boolean;
  source?: "gitignore" | "settings" | "both";
}
