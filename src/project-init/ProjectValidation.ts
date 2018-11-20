import chalk from "chalk";

import { FileUtils } from "../utils/FileUtils";

/**
 * Make sure Undoc is setup in valid environment
 */
export class ProjectValidation {
  async run(): Promise<void> {
    const rootDir = process.cwd();

    try {
      const undocConfig = FileUtils.fileExists(".undoc/config.json");

      if (undocConfig) {
        throw "Undoc is already setup in this directory";
      }

      const gitDir = FileUtils.fileExists(".git");

      if (!gitDir) {
        throw "Git is required to run Undoc. Make sure git is initialized and you are in the root directory of your project.";
      }

      return;
    } catch (err) {
      throw err;
    }
  }
}
