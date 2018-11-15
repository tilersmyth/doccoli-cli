import chalk from "chalk";

import { readDir, readFile } from "../utils/files";

/**
 * Make sure Undoc is setup in valid environment
 */
export class ProjectValidation {
  async run(): Promise<Boolean> {
    const rootDir = process.cwd();
    const undocDir = readDir(`${rootDir}/.undoc`);

    if (undocDir) {
      const existingProject = await readFile(`${rootDir}/.undoc/config.json`);

      if (existingProject) {
        console.log(
          chalk.red(`\nError: Undoc is already setup in this directory\n`)
        );
        return false;
      }
    }

    const gitDir = readDir(`${rootDir}/.git`);

    if (!gitDir) {
      console.log(
        chalk.red(
          "\nError: Git is required to run Undoc. Make sure git is initialized and you are in the root directory of your project.\n"
        )
      );
      return false;
    }

    return true;
  }
}
