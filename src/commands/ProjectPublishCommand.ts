import * as yargs from "yargs";

import { GetLastPublishedSha } from "../project-publish/GetLastPublishedSha";
import { NewProjectPublish } from "../project-publish/new-project/NewProjectPublish";
import { ExistingProjectPublish } from "../project-publish/existing-project/ExistingProjectPublish";

import PublishEvents from "../events/publish/Events";
import { NpmFile } from "../utils/NpmFile";

/**
 * Publish project
 */
export class ProjectPublishCommand {
  command = "publish";
  aliases = "p";
  describe = "Publish project updates to docs";

  builder(args: yargs.Argv) {
    return args.option("verbose", {
      default: false,
      describe: "Output more information during publishing"
    });
  }

  private event = async (status: any) => {
    const version = await NpmFile.version();
    const project = status.project;
    const user = status.user;
    return `Connected to ${project.name} (v${version}) as ${user.firstName} ${
      user.lastName
    }`;
  };

  handler = async (args: yargs.Arguments): Promise<void> => {
    try {
      // Start event listening
      PublishEvents.start(args.verbose);

      PublishEvents.emitter("init_publish", "Loading Undoc project");

      const publishStatus = await new GetLastPublishedSha().run();

      const context = await this.event(publishStatus);
      PublishEvents.emitter("init_connect", context);

      if (!publishStatus.commit) {
        PublishEvents.spinnerReset();
        await new NewProjectPublish().run();
        return;
      }

      await new ExistingProjectPublish(publishStatus).run();
    } catch (err) {
      PublishEvents.emitter("error_publish", err);
    } finally {
      // Stop event listening
      PublishEvents.stop();
    }
  };
}
