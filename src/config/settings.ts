// src/config/settings.ts
import * as vscode from "vscode";
import { ExtensionConfig } from "../types";

export function getConfiguration(): ExtensionConfig {
  const config = vscode.workspace.getConfiguration("repo2clip");
  return {
    alwaysIncludedFiles: config.get<string[]>("alwaysIncludedFiles", []),
    maxFileSize: config.get<number>("maxFileSize", 1000000),
  };
}
