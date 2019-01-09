import { CliLastCommit_cliLastCommit } from "../../types/schema";
import { NodeGit } from "../../lib/NodeGit";
import { GetExistingProjectFiles } from "./GetExistingProjectFiles";
import { ProjectTypeGenerator } from "../../project-type/ProjectTypeGenerator";
import { GetLineUpdates } from "./GetLineUpdates";

/**
 * Existing project publish
 */
export class ExistingProjectPublish {
  commit: CliLastCommit_cliLastCommit;

  constructor(commit: CliLastCommit_cliLastCommit) {
    this.commit = commit;
  }

  run = async (): Promise<void> => {
    try {
      // Publish up to date
      const lastCommit = await new NodeGit().lastCommit();
      if (lastCommit.sha() === this.commit.sha) {
        console.log("Undoc up-to-date. Nothing to do.");
        return;
      }

      const { files, update } = await new GetExistingProjectFiles(
        this.commit.sha
      ).run();

      // await new ProjectTypeGenerator(files).run();

      const updates = await new GetLineUpdates(update).run();

      console.log(updates);
    } catch (err) {
      throw err;
    }
  };
}
