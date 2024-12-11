// src/commands/copyWorkspace.ts
import * as vscode from "vscode";
import { formatOutput } from "../utils/formatter";
import { validatePath, getDirectoryStructure } from "../utils/fileSystem";

export async function copyWorkspace(uri?: vscode.Uri): Promise<void> {
  try {
    const targetPath = validatePath(uri);
    const result = getDirectoryStructure(targetPath, {
      includeContents: true,
    });

    const output = formatOutput(result, targetPath);
    await vscode.env.clipboard.writeText(output);
    vscode.window.showInformationMessage(
      "Complete workspace structure and contents copied to clipboard!"
    );
  } catch (error) {
    vscode.window.showErrorMessage(
      `Error: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}
