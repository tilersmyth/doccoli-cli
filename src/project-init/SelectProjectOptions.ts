import chalk from "chalk";
import * as inquirer from "inquirer";

import { FindUserProjectsApi } from "../api/FindUserProjectsApi";

import { CreateProjectMutation_cliCreateProject } from "../types/schema";

/**
 * Join existig Undoc project or create new
 */
export class SelectProjectOptions {
  private async getProjects() {
    return await new FindUserProjectsApi().results();
  }

  private inputs = [
    {
      type: "list",
      name: "selectedProject",
      message: "Choose existing Undoc project or create new",
      choices: []
    }
  ];

  run = async (): Promise<CreateProjectMutation_cliCreateProject | null> => {
    try {
      const projects = (await this.getProjects()) || [];

      if (projects.length === 0) {
        return null;
      }

      const projectChoices: any = [];
      for (const project of projects) {
        projectChoices.push({
          name: project.name,
          value: { key: project.key, name: project.name }
        });
        projectChoices.push(new inquirer.Separator());
      }

      projectChoices.push({ name: "Create new project", value: null });

      this.inputs[0].choices = projectChoices;

      const { selectedProject } = await (<any>inquirer.prompt(this.inputs));

      return selectedProject;
    } catch (err) {
      throw err;
    }
  };
}
