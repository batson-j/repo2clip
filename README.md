# Repo2Clip: Repository Structure and File Content to Clipboard for LLMs

Repo2Clip is a Visual Studio Code extension that helps developers share codebase context with Large Language Models (LLMs) by providing formatted directory structures and file contents.

## Features

### 1. Copy Repository Structure Only

Copies a clean directory tree structure to your clipboard - perfect for giving LLMs context about your project organization without overwhelming them with implementation details.

### 2. Copy Complete Workspace

Captures both the directory structure and the contents of all files in your workspace. Useful for in-depth code reviews or when you need to share comprehensive context.

### 3. Copy Workspace with Selected Content

Provides the full directory structure of your workspace but only includes file contents from the selected folder and all its subfolders. This means:

- You get the complete tree view of your entire workspace for context
- File contents are included only for:
  - Files in the selected folder
  - Files in all subfolders of the selected folder
  - Priority files (like README.md, package.json) from anywhere in the workspace

For example, if you select `src/features/auth/`:

- You'll see the structure of your entire project
- You'll get the contents of all files under `src/features/auth/` and its subfolders
- You'll still get contents of priority files like README.md from the root
- Other folders' contents will be omitted

This is particularly useful when:

- Working on a specific feature but need to show its context within the larger project
- Sharing a module's implementation while maintaining visibility of project structure
- Focusing on a particular area while keeping priority configuration files accessible

## Usage

### Via Command Palette

1. Open Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`)
2. Type "Repo2Clip" to see available commands:
   - `Repo2Clip: Copy Repository Structure Only`
   - `Repo2Clip: Copy Complete Workspace`
   - `Repo2Clip: Copy Workspace (Selected Folder Contents)`

### Via Context Menu

Right-click on any folder in the Explorer to access Repo2Clip commands.

## Configuration

Customize the extension through VS Code settings:

```json
{
  "repo2clip.alwaysIncludedFiles": [
    "readme.md",
    "package.json",
    "requirements.txt"
    // Add your own priority files
  ],
  "repo2clip.maxFileSize": 1000000 // Maximum file size in bytes to include
}
```

### Default Priority Files

The following files are always included when using "Copy Workspace" or "Copy Selected":

- readme.md
- package.json
- requirements.txt
- pyproject.toml
- cargo.toml
- go.mod
- gemfile
- composer.json
- build.gradle
- pom.xml

## Excluded Files and Directories

By default, the extension ignores common files and directories that typically don't provide useful context:

### Directories

- node_modules
- .git
- dist
- build
- And other common build/dependency directories

### Files

- .DS_Store
- package-lock.json
- \*.pyc
- And other common system/lock files

The extension also respects your project's `.gitignore` file.

## Installation

1. Open VS Code
2. Open Command Palette
3. Type "Extensions: Install from VSIX..."
4. Select the repo2clip.vsix file

Or install from the VS Code Marketplace [coming soon]

## Use with LLMs

### Example Prompt

```
Here's my project structure and relevant files:

[Paste clipboard content here]

Can you help me understand...
```

The extension formats output to be easily readable by both humans and LLMs, with clear separation between directory structure and file contents.

## Contributing

1. Clone the repository
2. `npm install`
3. Open in VS Code and press F5 to start debugging
4. Make your changes
5. Submit a Pull Request

## License

MIT License - see LICENSE.txt for details

## Release Notes

### 0.0.1

- Initial release
- Basic directory structure copying
- Workspace and selected folder content copying
- Priority file handling
- Gitignore support
