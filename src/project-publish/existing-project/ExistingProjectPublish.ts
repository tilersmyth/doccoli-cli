import * as moment from "moment";

import { IsoGit } from "../../lib/IsoGit";
import { ExistingProjectFiles } from "./ExistingProjectFiles";
import { ProjectTypeGenerator } from "../../project-type/ProjectTypeGenerator";
import { ProjectTypeParser } from "../../project-type/ProjectTypeParser";
import { PublishProjectUpdatedFiles } from "./PublishProjectUpdatedFiles";

import { GenerateOldFiles } from "./GenerateOldFiles";

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

      const modifiedFilesByOid = await projectFiles.getModifiedWithCommits(
        modifiedFiles
      );

      const oldFiles = await new GenerateOldFiles(modifiedFilesByOid).create();

      await new ProjectTypeGenerator(oldFiles, true).run();

      const allFiles = [...addedFiles, ...modifiedFiles];
      await new ProjectTypeGenerator(allFiles, false).run();

      const updateQueries = await new ProjectTypeParser(
        addedFiles,
        modifiedFilesByOid
      ).run();

      await new PublishProjectUpdatedFiles(updateQueries.modified).run();
    } catch (err) {
      throw err;
    }
  };
}
