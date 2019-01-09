import chalk from "chalk";
import * as inquirer from "inquirer";

import { CreateProjectApi } from "../api/CreateProjectApi";

import { CreateProjectMutation_cliCreateProject } from "../types/schema";

/**
 * Create new project
 */
export class CreateNewProject {
  private inputs = [
    {
      type: "input",
      name: "projectName",
      message: "Project name:"
    }
  ];

  run = async (): Promise<CreateProjectMutation_cliCreateProject> => {
    try {
      const { projectName } = await (<any>inquirer.prompt(this.inputs));

      const project = await new CreateProjectApi().results(projectName);

      console.log(chalk.green(`\n${project.name} successfully created\n`));

      return project;
    } catch (err) {
      throw err;
    }
  };
}
