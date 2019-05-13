import * as inquirer from "inquirer";

import { IsoGit } from "../../lib/IsoGit";
import { UndocFile } from "../../utils/UndocFile";
import { NpmFile } from "../../utils/NpmFile";

/**
 * Verfify project should be published
 */
export class NewPublishSpeedBump {
  constructor(private branches: string[]) {
    this.branches = branches;
  }

  private static branchList = (branches: string[]) => {
    const branchCount = branches.length;
    if (branchCount > 1) {
      return branches.reduce((acc: string, branch: string, index: number) => {
        return (acc +=
          index === 0
            ? `${branch}`
            : index + 1 < branchCount
            ? `, ${branch}`
            : ` and ${branch}`);
      }, "");
    }

    return branches.join();
  };

  private inputs = [
    {
      type: "confirm",
      name: "confirm",
      message: ""
    }
  ];

  private prompt = async (message: string) => {
    this.inputs[0].message = message;
    return <any>inquirer.prompt(this.inputs);
  };

  run = async (): Promise<Boolean> => {
    try {
      const version = await NpmFile.version();
      const config = await UndocFile.config();

      const iso = new IsoGit();
      const branch = await iso.git().currentBranch({
        dir: IsoGit.dir,
        fullname: false
      });

      // Project exists but not on current branch
      if (this.branches.length > 0) {
        const { confirm } = await this.prompt(
          `${config.name} Undoc exists on ${NewPublishSpeedBump.branchList(
            this.branches
          )}. Create on ${branch} @ v${version}?`
        );

        if (!confirm) {
          throw "Publish canceled";
        }

        return true;
      }

      const { confirm } = await this.prompt(
        `Start new Undoc for ${config.name} on ${await branch} @ v${version}?`
      );

      if (!confirm) {
        throw "Publish canceled";
      }

      return true;
    } catch (err) {
      throw err;
    }
  };
}
