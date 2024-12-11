// src/commands/copySelected.ts
import * as vscode from "vscode";
import {
  getDirectoryStructure,
  validatePath,
  getWorkspaceRoot,
} from "../utils/fileSystem";
import { formatOutput } from "../utils/formatter";

export async function copyWorkspaceSelected(uri?: vscode.Uri): Promise<void> {
  try {
    if (!uri) {
      throw new Error("No folder selected");
    }

    const selectedPath = uri.fsPath;
    const workspaceRoot = getWorkspaceRoot();

    // Get the complete workspace structure but only include contents for selected directory
    const result = getDirectoryStructure(workspaceRoot, {
      includeContents: true,
      targetDirectory: selectedPath,
    });

    const output = formatOutput(result, workspaceRoot);
    await vscode.env.clipboard.writeText(output);
    vscode.window.showInformationMessage(
      "Workspace structure with selected folder contents copied to clipboard!"
    );
  } catch (error) {
    vscode.window.showErrorMessage(
      `Error: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}
