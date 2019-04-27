import { FileUtils } from "../utils/FileUtils";
import { CreateProjectMutation_cliCreateProject } from "../types/schema";

/**
 * Create Undoc folder with config files
 */
export class CreateConfigFiles {
  project: CreateProjectMutation_cliCreateProject;

  constructor(project: CreateProjectMutation_cliCreateProject) {
    this.project = project;
  }

  run = async (): Promise<void> => {
    try {
      await FileUtils.createFile(
        ".undoc/config.json",
        `{"key":"${this.project.key}", "name":"${
          this.project.name
        }", "language": "typescript"}`
      );

      return;
    } catch (err) {
      throw err;
    }
  };
}
