import chalk from "chalk";
import { readDir, createDir, writeFile } from "../utils/files";

import { CreateProjectMutation_cliCreateProject_project } from "../types/schema";

/**
 * Create Undoc folder with config files
 */
export class CreateProjectFiles {
  project: CreateProjectMutation_cliCreateProject_project;

  constructor(project: CreateProjectMutation_cliCreateProject_project) {
    this.project = project;
  }

  private tdJson = {
    mode: "module",
    json: "./docs.json",
    excludeExternals: true,
    excludePrivate: true,
    excludeProtected: true,
    hideGenerator: true,
    stripInternal: true
  };

  run = async (): Promise<void> => {
    const rootDir = process.cwd();
    const undocDir = readDir(`${rootDir}/.undoc`);

    if (!undocDir) {
      createDir(`${rootDir}/.undoc`);
    }

    const projectFile = await writeFile(
      `${rootDir}/.undoc/config.json`,
      `{"key":"${this.project.key}", "name":"${this.project.name}"}`
    );

    if (!projectFile) {
      console.log(chalk.red(`\nerror creating project file\n`));
      return;
    }

    await writeFile(`${rootDir}/.undoc/td.json`, JSON.stringify(this.tdJson));
  };
}
