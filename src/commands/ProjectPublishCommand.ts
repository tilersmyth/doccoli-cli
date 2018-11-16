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
  describe = "Publish project updates to docs";

  private inputs = [
    {
      type: "confirm",
      name: "confirm",
      message: ""
    }
  ];

  handler = async (): Promise<void> => {
    const lastCommit = await new GetLastCommit().run();
    const branch = await new Commits().branch();
    const version = await npmVersion();
    const config = await undocConfig();

    if (!version || !config) {
      return;
    }

    if (!lastCommit) {
      this.inputs[0].message = `Start new Undoc for ${
        config.name
      } on ${branch} @ v${version}?`;
      const { confirm } = await (<any>inquirer.prompt(this.inputs));

      if (!confirm) {
        return;
      }
    }
  };
}
