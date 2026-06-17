#!/usr/bin/env node
import { Command } from "commander";
import chalk from "chalk";
import ora from "ora";
import path from "path";
import { generateLibrary, toPascalCase } from "./generator";

const program = new Command();

program
  .name("create-rn-lib")
  .description(
    "Scaffold a React / React Native library module with hooks, context, and provider"
  )
  .version("1.0.0");

// ─── create command ───────────────────────────────────────────────────────────
program
  .command("create <name>")
  .alias("c")
  .description("Create a new library module with the given name")
  .option(
    "-o, --out <dir>",
    "Output directory (defaults to current working directory)",
    process.cwd()
  )
  .action((name: string, options: { out: string }) => {
    const pascalName = toPascalCase(name);
    const outDir = path.resolve(options.out);

    console.log();
    console.log(
      chalk.bold.cyan("  create-rn-lib") +
        chalk.gray("  React / React Native library scaffolder")
    );
    console.log();

    const spinner = ora({
      text: `Generating ${chalk.bold(pascalName)} module…`,
      color: "cyan",
    }).start();

    try {
      const files = generateLibrary({ name, outDir });

      spinner.succeed(
        chalk.green(`Module ${chalk.bold(pascalName)} created successfully!`)
      );
      console.log();
      console.log(chalk.bold("  Generated files:"));
      console.log();

      for (const file of files) {
        console.log("  " + chalk.gray("├─") + " " + chalk.white(file.relativePath));
      }

      console.log();
      console.log(chalk.bold("  Structure:"));
      console.log();
      console.log(chalk.gray(`  ${pascalName}/`));
      console.log(chalk.gray(`  └── src/`));
      console.log(chalk.gray(`      ├── index.ts`));
      console.log(chalk.gray(`      ├── hooks/`));
      console.log(chalk.gray(`      │   ├── index.ts`));
      console.log(chalk.gray(`      │   ├── use${pascalName}.ts`));
      console.log(chalk.gray(`      │   └── use${pascalName}Context.ts`));
      console.log(chalk.gray(`      └── provider/`));
      console.log(chalk.gray(`          ├── index.ts`));
      console.log(chalk.gray(`          ├── ${pascalName}Context.ts`));
      console.log(chalk.gray(`          └── ${pascalName}Provider.tsx`));
      console.log();
      console.log(
        "  " +
          chalk.cyan("Next steps:") +
          " cd into " +
          chalk.bold(path.join(outDir, pascalName)) +
          " and start building!"
      );
      console.log();
    } catch (err: any) {
      spinner.fail(chalk.red("Failed to create module."));
      console.error();
      console.error("  " + chalk.red(err.message));
      console.error();
      process.exit(1);
    }
  });

// ─── preview command ──────────────────────────────────────────────────────────
program
  .command("preview <name>")
  .alias("p")
  .description("Preview what files would be generated WITHOUT writing to disk")
  .action((name: string) => {
    const { buildFileList, toPascalCase: toPC } = require("./generator");
    const pascalName = toPascalCase(name);

    console.log();
    console.log(
      chalk.bold.cyan("  create-rn-lib") + chalk.gray("  Preview mode (no files written)")
    );
    console.log();
    console.log(
      chalk.bold(`  Files that would be created for "${pascalName}":`)
    );
    console.log();

    const files = buildFileList(pascalName);
    for (const file of files) {
      console.log("  " + chalk.cyan("▸") + " " + chalk.white(file.relativePath));
    }

    console.log();
    console.log(
      chalk.gray('  Run "create-rn-lib create ') +
        chalk.white(name) +
        chalk.gray('" to generate these files.')
    );
    console.log();
  });

program.parse(process.argv);

// Show help if no command given
if (!process.argv.slice(2).length) {
  program.outputHelp();
}
