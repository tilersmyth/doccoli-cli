import chalk from "chalk";

import { Commits } from "../git/Commits";
import { GetLastCommit } from "../project/GetLastCommit";

/**
 * Publish project
 */
export class ProjectPublishCommand {
  command = "publish";
  describe = "Publish project updates to docs";

  async handler(): Promise<void> {
    const test = await new GetLastCommit().run();

    console.log(test);
  }
}
