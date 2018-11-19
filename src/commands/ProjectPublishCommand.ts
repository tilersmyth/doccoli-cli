import chalk from "chalk";

import { GetLastPublishedSha } from "../publish/GetLastPublishedSha";
import { NewPublishSpeedBump } from "../publish/NewPublishSpeedBump";

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
        await new NewPublishSpeedBump().run();
      }

      console.log("continue publishing!");
    } catch (err) {
      console.log(`\n${chalk.red(err)}\n`);
    }
  };
}
