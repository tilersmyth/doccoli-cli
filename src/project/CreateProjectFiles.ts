import * as inquirer from "inquirer";
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

    const { projectTarget } = await (<any>inquirer.prompt(this.inputs));

    if (!projectTarget) {
      console.log(chalk.red(`\nerror creating project file\n`));
      return;
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
      console.log(chalk.red(`\nerror creating project file\n`));
      return;
    }

    await writeFile(`${rootDir}/.undoc/td.json`, JSON.stringify(this.tdJson));

    console.log(
      chalk.green(
        `\nSuccess! Use command 'undoc publish' to create/update documentation\n`
      )
    );
  };
}
