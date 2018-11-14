import chalk from "chalk";
import * as inquirer from "inquirer";

import { MeCommand } from "./MeCommand";
import { LoginCommand } from "./LoginCommand";
import { FindUserProjectsCommand } from "./FindUserProjectsCommand";

import { readDir, readFile, createDir, writeFile } from "../utils/files";
import { createProjectInput } from "../utils/inputs";
import tdDefault from "../utils/td-defaults";

/**
 * Initialize new project
 */
export class ProjectInitCommand {
  command = "init";
  describe = "Initialize new project";

  async handler(): Promise<void> {
    const isAuth = new MeCommand().isAuth();

    if (!isAuth) {
      console.log(chalk.green("\n\nSign in to start new Doccoli project!\n\n"));

      const login = await new LoginCommand();

      if (!login) {
        return;
      }
    }

    const rootDir = process.cwd();
    const doccoliDir = readDir(`${rootDir}/.doccoli`);

    if (doccoliDir) {
      const existingProject = await readFile(`${rootDir}/.doccoli/config.json`);

      if (existingProject) {
        console.log(
          chalk.red(`\nDoccoli project already exists in this directory\n`)
        );
        return;
      }
    }

    console.log(chalk.green("\nStarting new Doccoli project!\n"));

    console.log(
      chalk.black.bgYellow(
        " Make sure you are in the root directory of your project \n\n"
      )
    );

    const projects = await new FindUserProjectsCommand().raw();

    const projectChoices: any = [];
    for (const project of projects) {
      projectChoices.push({
        name: project.name,
        value: project.key
      });
      projectChoices.push(new inquirer.Separator());
    }

    projectChoices.push({ name: "Create new project", value: null });

    createProjectInput[0].choices = projectChoices;

    const { id } = await (<any>inquirer.prompt(createProjectInput));

    if (!id) {
      console.log("\ncreate new project\n");
      return;
    }

    if (!doccoliDir) {
      createDir(`${rootDir}/.doccoli`);
    }

    const projectFile = await writeFile(
      `${rootDir}/.doccoli/config.json`,
      `{"key":"${id}"}`
    );

    if (!projectFile) {
      console.log(chalk.red(`\nerror creating project file\n`));
      return;
    }

    await writeFile(`${rootDir}/.doccoli/td.json`, JSON.stringify(tdDefault));
  }
}
