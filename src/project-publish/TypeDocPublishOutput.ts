import chalk from "chalk";
import * as readline from "readline";

/**
 * Output for TypeDoc generateJson
 */
export class TypeDocPublishOutput {
  fileTotal: number = 0;
  fileCount: number = 0;
  reflectionTotal: number = 0;
  reflectionCount: number = 0;

  private static percentOutput(action: string, i: number, size: number) {
    readline.clearLine(process.stdout, 0);
    readline.cursorTo(process.stdout, 0);
    const percentage = ((i / size) * 100).toFixed(0);
    process.stdout.write(chalk.white(`${action} ${percentage}%`));
  }

  logger = (event: string, context: any) => {
    if (event === "begin") {
      this.fileTotal = context.fileNames.length;
      console.log(chalk.white("Started TypeDoc compiling"));
    }

    if (event === "fileBegin") {
      const count = this.fileCount++;
      const total = this.fileTotal;

      TypeDocPublishOutput.percentOutput("Reviewing files", count, total);
    }

    if (event === "resolveBegin") {
      this.reflectionTotal = Object.keys(context.project.reflections).length;
      console.log("");
    }

    if (event === "resolveReflection") {
      const count = this.reflectionCount++;
      const total = this.reflectionTotal;
      TypeDocPublishOutput.percentOutput("Resolving reflections", count, total);
    }

    if (event === "end") {
      console.log(chalk.white("\nFinished TypeDoc compiling"));
    }
  };
}
