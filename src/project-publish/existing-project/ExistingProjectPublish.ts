import * as moment from "moment";

import { CliLastCommit_cliLastCommit } from "../../types/schema";
import { IsoGit } from "../../lib/IsoGit";
import { ExistingProjectFiles } from "./ExistingProjectFiles";
import { ProjectTypeGenerator } from "../../project-type/ProjectTypeGenerator";
import { ExistingProjectUpdates } from "./ExistingProjectUpdates";
import { ProjectTypeParser } from "../../project-type/ProjectTypeParser";
import { PublishProjectUpdatedFiles } from "./PublishProjectUpdatedFiles";

import PublishEvents from "../../events/publish/Events";

/**
 * Existing project publish
 */
export class ExistingProjectPublish {
  publishStatus: any;
  iso: IsoGit;

  constructor(publishStatus: any) {
    this.publishStatus = publishStatus;
    this.iso = new IsoGit();
  }

  private static shortSha(sha: string) {
    return sha.substring(0, 6);
  }

  private statusEvent = async (commit: string) => {
    const branch = await this.iso.branch();
    const sha = ExistingProjectPublish.shortSha(commit);
    const context = `Publishing update [${branch} ${sha}]`;
    PublishEvents.emitter("existing_publish", context);
  };

  run = async (): Promise<void> => {
    try {
      const lastCommitSha = await this.iso.lastCommitSha();

      const commit = this.publishStatus.commit;

      if (lastCommitSha === commit.sha) {
        const context = "Project up-to-date. Nothing to do.";
        PublishEvents.emitter("noaction_up_to_date", context);
        return;
      }

      await this.statusEvent(lastCommitSha);

      const projectFiles = new ExistingProjectFiles(commit.sha);

      const lastCommitPub = ExistingProjectPublish.shortSha(commit.sha);

      PublishEvents.emitter(
        "existing_last_commit",
        `Last published: [${lastCommitPub}] ${moment(
          commit.createdAt
        ).fromNow()}`
      );

      const { all, modified } = await projectFiles.get();

      PublishEvents.emitter(
        "existing_publish_modified",
        `${modified.length} tracked files modified`
      );

      PublishEvents.emitter("isogit_init", "Reviewing Git for file changes");

      const modifiedFilesByCommits = await projectFiles.getModifiedWithCommits(
        modified
      );

      const fileUpdates = await new ExistingProjectUpdates(
        modifiedFilesByCommits
      ).files();

      await new ProjectTypeGenerator(all, modified).run();

      const results = await new ProjectTypeParser(fileUpdates).run();

      console.log(results);

      // await new PublishProjectUpdatedFiles(results.updated).run();
    } catch (err) {
      throw err;
    }
  };
}
