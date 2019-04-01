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

      const { addedFiles, modifiedFiles } = await projectFiles.get();

      PublishEvents.emitter(
        "isogit_init",
        "Gathering modified file line changes"
      );

      const modifiedFilesByCommits = await projectFiles.getModifiedWithCommits(
        modifiedFiles
      );

      const modifiedFileLineDetail = await new ExistingProjectUpdates(
        modifiedFilesByCommits
      ).files();

      await new ProjectTypeGenerator(addedFiles, modifiedFiles).run();

      const updateQueries = await new ProjectTypeParser(
        addedFiles,
        modifiedFileLineDetail
      ).run();

      await new PublishProjectUpdatedFiles(updateQueries).run();
    } catch (err) {
      throw err;
    }
  };
}
