import chalk from "chalk";

import { ProjectUserAuth } from "../project-init/ProjectUserAuth";
import { CreateNewProject } from "../project-init/CreateNewProject";
import { ProjectValidation } from "../project-init/ProjectValidation";
import { SelectProjectOptions } from "../project-init/SelectProjectOptions";
import { CreateConfigFiles } from "../project-init/CreateConfigFiles";
import { ProjectDepInstall } from "../project-init/ProjectDepInstall";
import { ProjectDepSetup } from "../project-init/ProjectDepSetup";

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

      // 5. Generate undoc config file
      await new CreateConfigFiles(project).run();

      // 6. Install project doc generator
      await new ProjectDepInstall().run();

      // 7. Setup for generator type
      await new ProjectDepSetup().run();
    } catch (err) {
      console.log(`\n${chalk.red(err)}\n`);
    }
  }
}
