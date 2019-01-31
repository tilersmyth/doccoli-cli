import * as inquirer from "inquirer";

import { IsoGit } from "../../lib/IsoGit";
import { UndocFile } from "../../utils/UndocFile";
import { NpmFile } from "../../utils/NpmFile";

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
      const version = await NpmFile.version();
      const config = await UndocFile.config();

      const iso = new IsoGit();
      const branch = await iso.git().currentBranch({
        dir: IsoGit.dir,
        fullname: false
      });

      this.inputs[0].message = `Start new Undoc for ${
        config.name
      } on ${await branch} @ v${version}?`;

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
