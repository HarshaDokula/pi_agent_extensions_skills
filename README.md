# PI Dev Agent Extensions & Skills

A comprehensive collection of extensions and skills for the PI development agent, enabling intelligent workflow automation, code analysis, and development task orchestration.

## Overview

This repository contains:

- **Extensions**: Custom workflow implementations that enhance the PI agent's capabilities
- **Skills**: Specialized task handlers that guide the agent through specific development workflows

## Directory Structure

```
.
├── extensions/
│   └── context-workflow/          # Context-isolated workflow extension
│       ├── context-workflow.ts
│       ├── index.ts
│       └── README.md
└── skills/
    ├── build/                     # Implement focused tasks with tests
    ├── commit/                    # Stage and commit changes
    ├── compress/                  # Compress and optimize code
    ├── coverage/                  # Analyze test coverage
    ├── debug/                     # Debug and troubleshoot issues
    ├── plan/                      # Break down projects into tasks
    ├── refactor/                  # Simplify code without changing behavior
    ├── review/                    # Review code for quality
    ├── spec/                      # Define specifications
    └── tdd/                       # Test-driven development workflow
```

## Extensions

### Context-Isolated Workflow

Provides automated workflow orchestration with context compaction and unbiased review cycles. This extension solves the problem of manual, context-polluted agent interactions by automating the complete workflow: implementation → testing → review → refinement.

**Key Features:**
- Automatic context compaction between workflow phases
- Clean, unbiased code review with isolated context
- Deterministic validation and automated fixes
- Complete workflow automation from spec to verification

## Skills

### Build
Implement one task or scoped change: make the change, add valuable tests, and verify it works.

### Commit
Stage and commit the intended changes with a clear message.

### Compress
Compress and optimize code for better performance and maintainability.

### Coverage
Analyze test coverage to ensure adequate code testing.

### Debug
Debug and troubleshoot issues in the codebase.

### Plan
Break a project, phase, spec, or rough request into small agent-ready tasks with acceptance criteria and verification.

### Refactor
Refactor code to simplify it without changing behavior.

### Review
Review code for quality, correctness, and best practices.

### Spec
Define specifications and requirements for features or changes.

### TDD
Test-driven development workflow for implementing new functionality.

## Usage

Each skill is invocable through the PI agent with specific arguments and context. Refer to the individual SKILL.md files in each skill's directory for detailed usage instructions and process flows.

## Credits & Attribution

This repository is built from:

- **Extensions**: [pi-extensions](https://github.com/owainlewis/pi-extensions.git) by Owain Lewis
- **Skills**: [blueprint](https://github.com/owainlewis/blueprint.git) by Owain Lewis

These extensions and skills are curated and organized for use with the PI development agent framework.

## License

Please refer to the original source repositories for license information.

## Contributing

This is a curated collection of PI agent extensions and skills. For contributions or improvements, consider contributing to the original source repositories:
- https://github.com/owainlewis/pi-extensions
- https://github.com/owainlewis/blueprint
