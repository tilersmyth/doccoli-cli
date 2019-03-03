import { FileUtils } from "../utils/FileUtils";

import InitEvents from "../events/init/Events";

/**
 * Make sure Undoc is setup in valid environment
 */
export class ProjectValidation {
  async run(): Promise<void> {
    try {
      InitEvents.emitter(
        "init_project_validation",
        "Validating project workspace"
      );

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
