import chalk from "chalk";
import * as inquirer from "inquirer";

import { CreateProjectApi } from "../api/CreateProjectApi";

import keytar from "../utils/keytar";
import { createProjectInput } from "../utils/inputs";
import { CreateProjectMutation_cliCreateProject_project } from "../types/schema";

/**
 * Create new project
 */
export class CreateNewProject {
  run = async (): Promise<CreateProjectMutation_cliCreateProject_project | null> => {
    const token = await keytar.getToken();

    if (!token) {
      return null;
    }

    const { projectName } = await (<any>inquirer.prompt(createProjectInput));

    const result = await new CreateProjectApi(token).results(projectName);

    if (!result.ok) {
      console.log(chalk.red(`\n${result.error}\n`));
      return null;
    }

    console.log(
      chalk.green(`\n${result.project!.name} successfully created\n`)
    );

    return result.project;
  };
}
