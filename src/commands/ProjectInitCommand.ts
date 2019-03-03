import * as yargs from "yargs";

import { ProjectUserAuth } from "../project-init/ProjectUserAuth";
import { CreateNewProject } from "../project-init/CreateNewProject";
import { ProjectValidation } from "../project-init/ProjectValidation";
import { SelectProjectOptions } from "../project-init/SelectProjectOptions";
import { CreateConfigFiles } from "../project-init/CreateConfigFiles";
import { ProjectDepInstall } from "../project-init/ProjectDepInstall";
import { ProjectDepSetup } from "../project-init/ProjectDepSetup";

import InitEvents from "../events/init/Events";

/**
 * Initialize new project
 */
export class ProjectInitCommand {
  command = "init";
  aliases = "i";
  describe = "Initialize new project";

  builder(args: yargs.Argv) {
    return args.option("verbose", {
      default: false,
      describe: "Output more information during project initialization"
    });
  }

  async handler(args: yargs.Arguments): Promise<void> {
    try {
      InitEvents.start(args.verbose);

      // 1. Check user auth
      await new ProjectUserAuth().run();

      InitEvents.emitter("init_project", "Starting new Undoc setup!");

      // 2. Check project environment
      await new ProjectValidation().run();

      // Reset Ora spinner before select form
      InitEvents.spinnerReset();

      // 3. Select from existing projects
      let project = await new SelectProjectOptions().run();

      if (!project) {
        // 4. Create new project
        project = await new CreateNewProject().run();
      }

      InitEvents.emitter("config_file_create", "Writing config files");

      // 5. Generate undoc config file
      await new CreateConfigFiles(project).run();

      InitEvents.emitter(
        "dependency_install_init",
        "Installing required dependencies to Undoc folder"
      );

      // 6. Install project doc generator
      await new ProjectDepInstall().run();

      // Reset Ora spinner before setup form
      InitEvents.spinnerReset();

      // 7. Setup for generator type
      await new ProjectDepSetup().run();

      InitEvents.emitter(
        "done_creating_project",
        "Success! Use command 'undoc publish' to create/update documentation"
      );
    } catch (err) {
      InitEvents.emitter("error_publish", err);
    } finally {
      // Stop event listening
      InitEvents.stop();
    }
  }
}
