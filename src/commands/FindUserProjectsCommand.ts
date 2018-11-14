import chalk from "chalk";

import { FindUserProjectsApi } from "../api/FindUserProjectsApi";

import keytar from "../utils/keytar";
import { UserProjectsQuery_cliUserProjects } from "../types/schema";

/**
 * List projects where user is member of team
 */
export class FindUserProjectsCommand {
  command = "list-projects";
  describe = "List projects where user is member of team";

  private async getProjects() {
    const token = await keytar.getToken();
    if (!token) {
      console.log("Not authorized. Please login.");
      return;
    }
    return await new FindUserProjectsApi(token as string).results();
  }

  handler = async (): Promise<void> => {
    try {
      const projects = await this.getProjects();

      if (projects) {
        if (projects.length === 0) {
          console.log("\nyou have no projects\n");
          return;
        }

        console.log("\nHere are your projects:\n");
        for (const project of projects) {
          console.log(`\n${project.name}`);
        }
      }
    } catch (err) {
      console.log(`\n${chalk.red("Unexpected server error")}\n`);
    }
  };

  raw = async (): Promise<UserProjectsQuery_cliUserProjects[]> => {
    try {
      return (await this.getProjects()) || [];
    } catch (err) {
      console.log(`\n${chalk.red("Unexpected server error")}\n`);
      return [];
    }
  };
}
