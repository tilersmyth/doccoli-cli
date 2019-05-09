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
  reflectionTotal: number = 1;
  reflectionCount: number = 1;

  private static console(value: string) {
    process.stdout.write(chalk.white(`    ${value}`));
  }

  private static writeOutput(value: string) {
    readline.clearLine(process.stdout, 0);
    readline.cursorTo(process.stdout, 0);
    GeneratorLogger.console(value);
  }

  private verbose(event: string, context: any) {
    if (event === "fileBegin") {
      GeneratorLogger.writeOutput(context);
    }

    if (event === "resolveBegin") {
      GeneratorLogger.console("\n");
    }

    if (event === "resolveReflection") {
      GeneratorLogger.writeOutput(context);
    }

    if (event === "end") {
      GeneratorLogger.console("\n");
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
