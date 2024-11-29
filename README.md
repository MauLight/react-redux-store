# SYMETRIA boilerplate (React + Router + Tailwind)

This boilerplate offers a starting point for Symetria projects.

## Installation

To create a new project using this template, you can use the CLI tool provided by this package.

### Install Using npx

1. `npx symetria-template project-name`
2. Replace project-name with a desired name for your project.

### Global Installation

1. You can install the package globally with `npm install -g symetria-template`
2. Then run `symetria-template project-name`

How to run the template:

2. Run `npm start` (default port= 3000)
   (\*) To change port go to vite.config.ts and specify a new port under server/port.

**Important:**
Formatting should be handled by eslint, please add this settings to your VS Code settings JSON file:

> "eslint.format.enable": true,
> "editor.codeActionsOnSave": {
> "source.addMissingImports.ts": "explicit",
> "source.fixAll.eslint": "always"
> },
> "eslint.validate": ["javascript"],
