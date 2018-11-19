import * as inquirer from "inquirer";
import chalk from "chalk";

import { readDir, createDir, writeFile } from "../utils/files";

import { CreateProjectMutation_cliCreateProject } from "../types/schema";

/**
 * Create Undoc folder with config files
 */
export class CreateProjectFiles {
  project: CreateProjectMutation_cliCreateProject;

  constructor(project: CreateProjectMutation_cliCreateProject) {
    this.project = project;
  }

  private inputs = [
    {
      type: "list",
      name: "projectTarget",
      message: "Project ECMAScript target version:",
      choices: [
        { name: "ES6", value: "ES6" },
        { name: "ES5", value: "ES5" },
        { name: "ES3", value: "ES3" }
      ]
    }
  ];

  private tdJson: any = {
    mode: "modules",
    json: "./.undoc/docs.json",
    module: "commonjs",
    excludeExternals: true,
    excludePrivate: true,
    excludeProtected: true,
    hideGenerator: true,
    stripInternal: true
  };

  run = async (): Promise<void> => {
    const rootDir = process.cwd();

    try {
      const undocDir = readDir(`${rootDir}/.undoc`);

      const { projectTarget } = await (<any>inquirer.prompt(this.inputs));

      if (!projectTarget) {
        throw "error creating project file";
      }

      this.tdJson.target = projectTarget;

      if (!undocDir) {
        createDir(`${rootDir}/.undoc`);
      }

      const projectFile = await writeFile(
        `${rootDir}/.undoc/config.json`,
        `{"key":"${this.project.key}", "name":"${this.project.name}"}`
      );

      if (!projectFile) {
        throw "error creating project file";
      }

      await writeFile(`${rootDir}/.undoc/td.json`, JSON.stringify(this.tdJson));

      console.log(
        chalk.green(
          `\nSuccess! Use command 'undoc publish' to create/update documentation\n`
        )
      );
    } catch (err) {
      throw err;
    }
  };
}
