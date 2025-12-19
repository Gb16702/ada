#!/usr/bin/env bun
import { parseArgs } from 'node:util';
import { generateProject } from './generator';
import { runPrompts } from './prompts';

async function main(): Promise<void> {
  const { values, positionals } = parseArgs({
    args: Bun.argv.slice(2),
    options: {
      preset: {
        type: 'string',
        short: 'p',
      },
      theme: {
        type: 'string',
        short: 't',
      },
      yes: {
        type: 'boolean',
        short: 'y',
        default: false,
      },
      help: {
        type: 'boolean',
        short: 'h',
        default: false,
      },
      version: {
        type: 'boolean',
        short: 'v',
        default: false,
      },
    },
    allowPositionals: true,
  });

  if (values.help) {
    printHelp();
    process.exit(0);
  }

  if (values.version) {
    console.log('create-ada v0.1.0');
    process.exit(0);
  }

  const projectName = positionals[0];
  const config = await runPrompts(projectName, values.preset, values.theme, values.yes);

  if (!config) {
    process.exit(1);
  }

  const success = await generateProject(config);
  process.exit(success ? 0 : 1);
}

function printHelp(): void {
  console.log(`
create-ada - Create professional frontend projects

Usage:
  bun create ada <project-name> [options]

Options:
  -p, --preset <preset>  Use a preset (minimal, standard, enterprise, custom)
  -t, --theme <theme>    Theme color (blue, indigo, purple, pink, teal, green, cyan, peach, black)
  -y, --yes              Skip confirmation prompts
  -h, --help             Show this help message
  -v, --version          Show version number

Presets:
  minimal     Core only - React, TanStack Start, TypeScript, Tailwind, Biome
  standard    Recommended - Includes data fetching, forms, API client, unit tests
  enterprise  Full-featured - Includes auth, state management, E2E tests
  custom      Choose your own features

Examples:
  bun create ada my-app
  bun create ada my-app --preset standard
  bun create ada my-app -p enterprise -y
`);
}

main().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});
