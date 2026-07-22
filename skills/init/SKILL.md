---
name: init
description: Scans the current project and creates/updates AGENTS.md with project context including structure, conventions, dependencies, and build/run commands. Run this when starting work on a new project or when project setup changes significantly.
---

# /init — Project Initialization

This skill scans the current project and creates or updates an `AGENTS.md` file in the project root. This file serves as a persistent context document for the AI coding agent, containing essential project information.

Pi automatically loads `AGENTS.md` (and `CLAUDE.md`) at startup from the current directory and parent directories, so this file will be picked up in every session.

## Behavior

- If `AGENTS.md` already exists, ask the user whether to overwrite or update it
- If the user wants to update, read the existing file first and preserve its structure, only refreshing sections that may be out of date

## Instructions

1. **Scan the project root** (`cwd`). Use `bash` commands to gather:
   - Top-level files and directories (use `ls -la`)
   - `package.json`, `Cargo.toml`, `pyproject.toml`, `go.mod`, `Gemfile`, `CMakeLists.txt`, `Makefile`, `composer.json`, `build.gradle`, or other build files to determine language/stack
   - Key configuration files (tsconfig, vite config, webpack config, etc.)
   - `.gitignore`, `.dockerignore`, etc.
   - Any existing documentation files like `README.md`, `CONTRIBUTING.md`, `docs/` folder

2. **Analyze project structure**:
   - Read `package.json` (if exists) for scripts, dependencies, and project metadata
   - Read key config files to understand the tech stack
   - Check for Docker, CI/CD configs, tests directory structure
   - Run `git branch` and `git log --oneline -5` to understand current git state

3. **Create/update `AGENTS.md`** with the following sections:

   ```markdown
   # Project: <project-name>

   ## Tech Stack
   - Language: <primary language>
   - Framework: <framework if any>
   - Build tool: <build tool>
   - Package manager: <package manager>
   - Database: <if applicable>
   - Other key technologies

   ## Project Structure
   Brief overview of key directories and their purpose.

   ## Development Commands
   - Build: `npm run build` (or equivalent)
   - Dev: `npm run dev` (or equivalent)
   - Test: `npm test` (or equivalent)
   - Lint: `npm run lint` (or equivalent)
   - Other important commands

   ## Key Dependencies
   List important dependencies (framework, major libraries, dev tools).

   ## Code Conventions
   - Naming conventions (inferred from codebase scan)
   - Import style
   - Testing conventions
   - Any patterns observed in the codebase

   ## Architecture Notes
   Brief description of the architecture, data flow, key modules.

   ## Environment
   - Node version (from .nvmrc, .node-version, package.json engines)
   - Other version requirements
   ```

4. **Write the file** using the `write` tool to `AGENTS.md` in the project root directory.

5. **Report** what was found and what was written.

## Notes

- Be thorough but concise. The file should be readable by both humans and AI agents.
- Focus on information that would help an AI agent assist with this project.
- If the project is very large, focus on the most important directories and files rather than listing everything.
- Use `rg` or `grep` to detect patterns only if helpful for understanding conventions.
