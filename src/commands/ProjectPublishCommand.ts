import chalk from "chalk";

import { GetLastPublishedSha } from "../publish/GetLastPublishedSha";
import { NewProjectPublish } from "../publish/NewProjectPublish";
import { ExistingProjectPublish } from "../publish/ExistingProjectPublish";

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
