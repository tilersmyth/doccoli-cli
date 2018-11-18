import chalk from "chalk";

import { readDir, readFile } from "../utils/files";

/**
 * Make sure Undoc is setup in valid environment
 */
export class ProjectValidation {
  async run(): Promise<void> {
    const rootDir = process.cwd();

    try {
      const undocDir = readDir(`${rootDir}/.undoc`);

      if (undocDir) {
        const existingProject = await readFile(`${rootDir}/.undoc/config.json`);

        if (existingProject) {
          throw "Undoc is already setup in this directory";
        }
      }

      const gitDir = readDir(`${rootDir}/.git`);

      if (!gitDir) {
        throw "Git is required to run Undoc. Make sure git is initialized and you are in the root directory of your project.";
      }

      return;
    } catch (err) {
      throw err;
    }
  }
}
