import chalk from "chalk";
import * as ora from "ora";
import * as readline from "readline";

import { EventToken } from "../../Types";

export class GeneratorLogger {
  spinner: ora.Ora;

  constructor(spinner: ora.Ora) {
    this.spinner = spinner;
  }

  fileCount: number = 0;
  reflectionTotal: number = 0;
  reflectionCount: number = 0;

  private static console(value: string) {
    process.stdout.write(chalk.white(`    ${value}`));
  }

  private static writeOutput(value: string) {
    readline.clearLine(process.stdout, 0);
    readline.cursorTo(process.stdout, 0);
    GeneratorLogger.console(value);
  }

  private verbose(event: string, context: any) {
    if (event === "begin") {
      GeneratorLogger.console("Started TypeDoc compiling");
    }

    if (event === "fileBegin") {
      const count = this.fileCount++;
      GeneratorLogger.writeOutput(`Reviewing ${count} files`);
    }

    if (event === "resolveBegin") {
      this.reflectionTotal = Object.keys(context.project.reflections).length;
      console.log("");
    }

    if (event === "resolveReflection") {
      const count = this.reflectionCount++;
      const total = this.reflectionTotal;
      const percentage = ((count / total) * 100).toFixed(0);
      GeneratorLogger.writeOutput(`Resolving reflections ${percentage}%`);
    }

    if (event === "end") {
      console.log("");
      GeneratorLogger.console("Finished TypeDoc compiling\n");
    }
  }

  log = (context: any, newEvent: EventToken, __: EventToken): void => {
    if (newEvent.payload === "init") {
      this.spinner.start(chalk.bold.whiteBright(context));
      return;
    }

    this.verbose(newEvent.payload, context);
  };
}
