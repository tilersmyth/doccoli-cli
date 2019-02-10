import { CliLastCommit_cliLastCommit } from "../../types/schema";
import { IsoGit } from "../../lib/IsoGit";
import { ExistingProjectFiles } from "./ExistingProjectFiles";
import { ProjectTypeGenerator } from "../../project-type/ProjectTypeGenerator";
import { ExistingProjectUpdates } from "./ExistingProjectUpdates";

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
      const git = new IsoGit().git();
      const lastCommit = await git.fetch({
        dir: IsoGit.dir,
        depth: 1
      });

      if (!lastCommit.fetchHead) {
        throw "Unable to determine current commit";
      }

      if (lastCommit.fetchHead === this.commit.sha) {
        console.log("Undoc up-to-date. Nothing to do.");
        return;
      }

      const projectFiles = new ExistingProjectFiles(this.commit.sha);

      const { all, modified } = await projectFiles.get();

      await new ProjectTypeGenerator(all, modified).run();

      const modifiedFilesByCommits = await projectFiles.getModifiedWithCommits(
        modified
      );

      const fileUpdates = await new ExistingProjectUpdates(
        modifiedFilesByCommits
      ).files();

      console.log(fileUpdates);

      // Next: make updates on modified files
    } catch (err) {
      throw err;
    }
  };
}
