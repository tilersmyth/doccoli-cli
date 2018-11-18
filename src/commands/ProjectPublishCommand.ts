import chalk from "chalk";
import * as inquirer from "inquirer";

import { Commits } from "../git/Commits";
import { GetLastCommit } from "../project/GetLastCommit";

import { npmVersion, undocConfig } from "../utils/configFile";

/**
 * Publish project
 */
export class ProjectPublishCommand {
  command = "publish";
  aliases = "p";
  describe = "Publish project updates to docs";

  private inputs = [
    {
      type: "confirm",
      name: "confirm",
      message: ""
    }
  ];

  handler = async (): Promise<void> => {
    try {
      const lastCommit = await new GetLastCommit().run();
      const commit = new Commits();
      const version = await npmVersion();
      const config = await undocConfig();

      if (!version || !config) {
        return;
      }

      if (!lastCommit) {
        this.inputs[0].message = `Start new Undoc for ${
          config.name
        } on ${await commit.branch()} @ v${version}?`;

        const { confirm } = await (<any>inquirer.prompt(this.inputs));

        if (!confirm) {
          return;
        }

        const initialCommit = await commit.initialCommit();

        console.log(initialCommit);
      }
    } catch (err) {
      console.log(`\n${chalk.red(err)}\n`);
    }
  };
}
