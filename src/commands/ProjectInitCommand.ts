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
    const auth = await new ProjectUserAuth().run();
    if (!auth) return;

    // 2. Check project environment
    const valiation = await new ProjectValidation().run();
    if (!valiation) return;

    console.log(chalk.green("\nStarting new Undoc setup!\n"));

    // 3. Select from existing projects
    let project = await new SelectProjectOptions().run();

    if (!project) {
      // 4. Create new project
      project = await new CreateNewProject().run();
      if (!project) return;
    }

    //5. Generate undoc config files
    await new CreateProjectFiles(project).run();
  }
}
