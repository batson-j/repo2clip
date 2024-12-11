// src/commands/copyStructure.ts
import * as vscode from "vscode";
import { getDirectoryStructure, validatePath } from "../utils/fileSystem";

export async function copyStructureOnly(uri?: vscode.Uri): Promise<void> {
  try {
    const targetPath = validatePath(uri);
    const result = getDirectoryStructure(targetPath, {
      includeContents: false,
    });

    // Only copy the structure part
    await vscode.env.clipboard.writeText(result.structure);
    vscode.window.showInformationMessage(
      "Directory structure copied to clipboard!"
    );
  } catch (error) {
    vscode.window.showErrorMessage(
      `Error: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}
