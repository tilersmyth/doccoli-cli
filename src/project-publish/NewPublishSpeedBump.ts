import * as inquirer from "inquirer";

import { NodeGit } from "../lib/NodeGit";
import { UndocFiles } from "../utils/UndocFiles";
import { NpmFile } from "../utils/NpmFile";

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
      const commit = new NodeGit();
      const version = await NpmFile.version();
      const config = await UndocFiles.config();

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
