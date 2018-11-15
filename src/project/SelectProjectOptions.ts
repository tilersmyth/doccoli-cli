import chalk from "chalk";
import * as inquirer from "inquirer";

import { FindUserProjectsApi } from "../api/FindUserProjectsApi";

import keytar from "../utils/keytar";
import { projectOptionsInput } from "../utils/inputs";

/**
 * Join existig Undoc project or create new
 */
export class SelectProjectOptions {
  private async getProjects() {
    const token = await keytar.getToken();
    if (!token) {
      console.log(chalk.red("Not authorized. Please login."));
      return;
    }
    return await new FindUserProjectsApi(token as string).results();
  }

  async run(): Promise<string | null> {
    const projects = (await this.getProjects()) || [];

    if (projects.length === 0) {
      return null;
    }

    const projectChoices: any = [];
    for (const project of projects) {
      projectChoices.push({
        name: project.name,
        value: project.key
      });
      projectChoices.push(new inquirer.Separator());
    }

    projectChoices.push({ name: "Create new project", value: null });

    projectOptionsInput[0].choices = projectChoices;

    const { id } = await (<any>inquirer.prompt(projectOptionsInput));

    return id;
  }
}
