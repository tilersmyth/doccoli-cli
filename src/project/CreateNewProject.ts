import chalk from "chalk";
import * as inquirer from "inquirer";

import { CreateProjectApi } from "../api/CreateProjectApi";

import keytar from "../utils/keytar";
import { createProjectInput } from "../utils/inputs";

/**
 * Create new project
 */
export class CreateNewProject {
  run = async (): Promise<string | null> => {
    const token = await keytar.getToken();

    if (!token) {
      console.log(chalk.red("Not authorized. Please login."));
      return null;
    }

    const { projectName } = await (<any>inquirer.prompt(createProjectInput));

    const result = await new CreateProjectApi(token as string).results(
      projectName
    );

    if (!result.ok) {
      console.log(chalk.red(`\n${result.error}\n`));
      return null;
    }

    console.log(
      chalk.green(`\n${result.project!.name} successfully created\n`)
    );

    return result.project!.id;
  };
}