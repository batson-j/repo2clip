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
  - Files matching your `alwaysIncluded` patterns

## Installation

### Requirements

- Visual Studio Code 1.80.0 or higher
- Node.js 16.x or higher
- npm 7.x or higher

### Installation Steps

1. Open VS Code
2. Open Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`)
3. Type "Extensions: Install from VSIX..."
4. Select the repo2clip.vsix file

Or install from the VS Code Marketplace [coming soon]

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

### Basic Configuration

```jsonc
{
  // Files to always include (using .gitignore pattern syntax)
  "repo2clip.alwaysIncluded": [
    "readme.md",
    "**/*.config.{js,json}",
    "src/**/*.{ts,tsx}"
  ],

  // Files to always exclude
  "repo2clip.alwaysExcluded": [
    "**/node_modules/**",
    "**/*.test.{ts,js}",
    "**/dist/**"
  ],

  // Maximum file size in bytes
  "repo2clip.maxFileSize": 1000000
}
```

### Pattern Matching

Repo2Clip uses .gitignore pattern syntax for both inclusion and exclusion rules. Patterns are matched against file paths relative to the workspace root.

#### Pattern Syntax

- `*` matches any characters except `/`
- `**` matches any characters including `/`
- `?` matches a single character except `/`
- `!` negates a pattern
- `/` matches directory separators
- Lines starting with `#` are comments

#### Pattern Examples

```jsonc
{
  "repo2clip.alwaysIncluded": [
    // Documentation
    "**/*.md", // All markdown files
    "docs/**/*.{md,txt}", // All docs in markdown or text

    // Configuration
    "**/config.*", // Any config file
    "**/*.config.{js,json,ts}", // All config files with specific extensions

    // Source code
    "src/**/*.{ts,tsx}", // All TypeScript files under src
    "!src/**/*.test.ts", // Exclude test files

    // API definitions
    "api/**/*.{yaml,json}", // All API specs

    // Important project files
    "package.json",
    "**/tsconfig.json"
  ]
}
```

### Priority and Conflict Resolution

1. Include/Exclude Priority:

   - `alwaysIncluded` patterns take highest precedence
   - `.gitignore` and `alwaysExcluded` patterns are combined
   - When conflicts occur, inclusion wins and a warning is shown

2. File Order:
   - README.md files always appear first
   - Other included files appear in the order of matching patterns
   - Regular files appear after the directory structure

### Default Patterns

#### Default Included Files

```jsonc
[
  "readme.md",
  "package.json",
  "requirements.txt",
  "pyproject.toml",
  "cargo.toml",
  "go.mod",
  "gemfile",
  "composer.json",
  "build.gradle",
  "pom.xml"
]
```

#### Default Excluded Patterns

```jsonc
[
  // Build artifacts
  "**/*.pyc",
  "**/*.exe",
  "**/*.dll",
  "**/*.so",

  // System files
  "**/.DS_Store",
  "**/Thumbs.db",

  // Dependencies
  "**/node_modules/**",
  "**/venv/**",

  // Build outputs
  "**/dist/**",
  "**/build/**"

  // Full list in package.json
]
```

## Best Practices

1. **Pattern Organization**

   - Group patterns by purpose (docs, config, source, etc.)
   - Use comments to explain complex patterns
   - Start with more specific patterns before general ones

2. **Performance**

   - Be specific with include patterns to avoid processing unnecessary files
   - Use `maxFileSize` to prevent large file processing
   - Consider using `Copy Workspace (Selected Folder Contents)` for large repos

3. **Security**
   - Review copied content before sharing with LLMs
   - Add sensitive file patterns to `alwaysExcluded`
   - Use `.gitignore` in conjunction with extension patterns

## Troubleshooting

### Common Issues

1. **Files Not Being Included**

   - Check pattern syntax
   - Verify file isn't matched by exclude patterns
   - Check file size against `maxFileSize`

   ```jsonc
   // Make pattern more specific
   "repo2clip.alwaysIncluded": ["src/specific/path/**/*.ts"]
   ```

2. **Performance Issues**

   - Reduce scope of include patterns
   - Increase exclude patterns
   - Use selected folder copy instead of complete workspace

   ```jsonc
   // Optimize patterns
   "repo2clip.alwaysExcluded": ["**/node_modules/**", "**/dist/**"]
   ```

3. **Pattern Conflicts**
   - Review warning messages
   - Make patterns more specific
   - Check pattern order in arrays
   ```jsonc
   // Fix conflicts
   "repo2clip.alwaysIncluded": ["src/**/*.ts", "!src/**/*.test.ts"]
   ```

## Use with LLMs

### Example Prompt

```
Here's my project structure and relevant files:

[Paste clipboard content here]

Can you help me understand...
```

The extension formats output to be easily readable by both humans and LLMs, with clear separation between directory structure and file contents.

## License

[MIT License](LICENSE.txt)

## Release Notes

### 0.0.1

- Initial release
- Pattern-based file inclusion/exclusion
- Gitignore integration
- Priority file handling
- Conflict detection and warning system
- Directory structure visualization
- Selected folder content support
