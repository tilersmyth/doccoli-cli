import chalk from "chalk";

import { ProjectUserAuth } from "../project/ProjectUserAuth";
import { CreateNewProject } from "../project/CreateNewProject";
import { ProjectValidation } from "../project/ProjectValidation";
import { SelectProjectOptions } from "../project/SelectProjectOptions";
import { CreateProjectFiles } from "../project/CreateProjectFiles";

/**
 * Initialize new project
 */
export class ProjectInitCommand {
  command = "init";
  aliases = "i";
  describe = "Initialize new project";

  async handler(): Promise<void> {
    try {
      // 1. Check user auth
      await new ProjectUserAuth().run();

      // 2. Check project environment
      await new ProjectValidation().run();

      console.log(chalk.green("\nStarting new Undoc setup!\n"));

      // 3. Select from existing projects
      let project = await new SelectProjectOptions().run();

      if (!project) {
        // 4. Create new project
        project = await new CreateNewProject().run();
      }

      //5. Generate undoc config files
      await new CreateProjectFiles(project).run();
    } catch (err) {
      console.log(`\n${chalk.red(err)}\n`);
    }
  }
}
