// src/extension.ts
import * as vscode from "vscode";
import {
  copyStructureOnly,
  copyWorkspace,
  copyWorkspaceSelected,
} from "./commands";

export function activate(context: vscode.ExtensionContext) {
  console.log("Repo2Clip: Starting activation");

  try {
    // Register copyStructureOnly command
    const structureCommand = vscode.commands.registerCommand(
      "repo2clip.copyStructureOnly",
      async (uri?: vscode.Uri) => {
        console.log("Repo2Clip: copyStructureOnly command triggered", {
          uri: uri?.fsPath || "no URI provided",
        });
        try {
          await copyStructureOnly(uri);
          console.log("Repo2Clip: copyStructureOnly completed successfully");
        } catch (error) {
          console.error("Repo2Clip: Error in copyStructureOnly:", error);
          throw error;
        }
      }
    );

    // Register copyWorkspace command
    const workspaceCommand = vscode.commands.registerCommand(
      "repo2clip.copyWorkspace",
      async (uri?: vscode.Uri) => {
        console.log("Repo2Clip: copyWorkspace command triggered", {
          uri: uri?.fsPath || "no URI provided",
        });
        try {
          await copyWorkspace(uri);
          console.log("Repo2Clip: copyWorkspace completed successfully");
        } catch (error) {
          console.error("Repo2Clip: Error in copyWorkspace:", error);
          throw error;
        }
      }
    );

    // Register copyWorkspaceSelected command
    const selectedCommand = vscode.commands.registerCommand(
      "repo2clip.copyWorkspaceSelected",
      async (uri?: vscode.Uri) => {
        console.log("Repo2Clip: copyWorkspaceSelected command triggered", {
          uri: uri?.fsPath || "no URI provided",
        });
        try {
          await copyWorkspaceSelected(uri);
          console.log(
            "Repo2Clip: copyWorkspaceSelected completed successfully"
          );
        } catch (error) {
          console.error("Repo2Clip: Error in copyWorkspaceSelected:", error);
          throw error;
        }
      }
    );

    // Add commands to subscriptions
    context.subscriptions.push(structureCommand);
    context.subscriptions.push(workspaceCommand);
    context.subscriptions.push(selectedCommand);

    console.log("Repo2Clip: All commands registered successfully");
    console.log("Repo2Clip: Extension activated successfully");

    // Log available commands
    vscode.commands.getCommands(true).then((commands) => {
      const ourCommands = commands.filter((cmd) => cmd.startsWith("repo2clip"));
      console.log("Repo2Clip: Available commands:", ourCommands);
    });
  } catch (error) {
    console.error("Repo2Clip: Error during activation:", error);
    throw error;
  }
}

export function deactivate() {
  console.log("Repo2Clip: Extension deactivated");
}
