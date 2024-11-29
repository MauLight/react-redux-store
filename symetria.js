#!/usr/bin/env node

import { execSync } from 'child_process';
import { existsSync, mkdirSync } from 'fs';
import ora from 'ora';

const projectName = process.argv[2] || 'symetria-app';

const spinner = ora(`Execution of new project: ${projectName}...`).start();

try {
    if (!existsSync(projectName)) {
        mkdirSync(projectName);
    }

    execSync(`npx degit MauLight/symetria-template ${projectName}`, { stdio: 'inherit' });

    spinner.text = 'Installing dependencies...';
    execSync(`cd ${projectName} && npm install`, { stdio: 'inherit' });

    spinner.succeed('Done! Symetria is ready.');
} catch (error) {
    spinner.fail('An error occurred.');
    console.error(error);
}