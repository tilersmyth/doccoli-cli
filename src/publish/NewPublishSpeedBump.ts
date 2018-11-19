import * as inquirer from "inquirer";

import { Nodegit } from "../lib/Nodegit";
import { npmVersion, undocConfig } from "../utils/configFile";

/**
 * Verfify project should be published
 */
export class NewPublishSpeedBump {
  private inputs = [
    {
      type: "confirm",
      name: "confirm",
      message: ""
    }
  ];

  run = async (): Promise<Boolean> => {
    try {
      const commit = new Nodegit();
      const version = await npmVersion();
      const config = await undocConfig();

      this.inputs[0].message = `Start new Undoc for ${
        config.name
      } on ${await commit.branch()} @ v${version}?`;

      const { confirm } = await (<any>inquirer.prompt(this.inputs));

      if (!confirm) {
        throw "Publish canceled";
      }

      return true;
    } catch (err) {
      throw err;
    }
  };
}
