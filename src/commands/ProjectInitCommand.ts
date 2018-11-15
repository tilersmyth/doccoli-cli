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
  describe = "Initialize new project";

  async handler(): Promise<void> {
    // 1. Check user auth
    await new ProjectUserAuth().run();

    // 2. Check project environment
    await new ProjectValidation().run();

    console.log(chalk.green("\nStarting new Undoc setup!\n"));

    // 3. Select from existing projects
    let id = await new SelectProjectOptions().run();

    if (!id) {
      // 4. Create new project
      id = await new CreateNewProject().run();
      if (!id) return;
    }

    //5. Generate undoc config files
    await new CreateProjectFiles(id).run();
  }
}
