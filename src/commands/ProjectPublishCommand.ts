import chalk from "chalk";

import { GetLastPublishedSha } from "../project-publish/GetLastPublishedSha";
import { NewProjectPublish } from "../project-publish/NewProjectPublish";
import { ExistingProjectPublish } from "../project-publish/ExistingProjectPublish";

/**
 * Publish project
 */
export class ProjectPublishCommand {
  command = "publish";
  aliases = "p";
  describe = "Publish project updates to docs";

  handler = async (): Promise<void> => {
    try {
      const lastPublishedSha = await new GetLastPublishedSha().run();

      if (!lastPublishedSha) {
        await new NewProjectPublish().run();
        return;
      }

      await new ExistingProjectPublish(lastPublishedSha).run();
    } catch (err) {
      console.log(`\n${chalk.red(err)}\n`);
    }
  };
}
