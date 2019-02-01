import { CliLastCommit_cliLastCommit } from "../../types/schema";
import { IsoGit } from "../../lib/IsoGit";
import { GetExistingProjectFiles } from "./GetExistingProjectFiles";
import { ProjectTypeGenerator } from "../../project-type/ProjectTypeGenerator";
import { GetModifiedFileCommits } from "./GetModifiedFileCommits";

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

      const projectFiles = await new GetExistingProjectFiles(
        this.commit.sha
      ).run();

      await new ProjectTypeGenerator(
        projectFiles.all,
        projectFiles.modified
      ).run();

      const modifiedFilesWithCommits = await new GetModifiedFileCommits(
        this.commit.sha,
        projectFiles.modified
      ).run();

      console.log(modifiedFilesWithCommits);

      // Next: make updates on modified files
    } catch (err) {
      throw err;
    }
  };
}
