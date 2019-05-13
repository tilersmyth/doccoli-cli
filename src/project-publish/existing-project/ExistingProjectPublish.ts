import { RepoSpeedBump } from "./RepoSpeedBump";
import { GetAllProjectFiles } from "../new-project/GetAllProjectFiles";
import { ProjectTypeGenerator } from "../../project-type/ProjectTypeGenerator";
import { ProjectTypeParser } from "../../project-type/ProjectTypeParser";
import { PublishProjectUpdatedFiles } from "./PublishProjectUpdatedFiles";
import { ProjectFiles } from "./ProjectFiles";
import { ModifiedFileOids } from "./ModifiedFileOids";

/**
 * Existing project publish
 */
export class ExistingProjectPublish {
  publishStatus: any;

  constructor(publishStatus: any) {
    this.publishStatus = publishStatus;
  }

  run = async (): Promise<void> => {
    try {
      const remoteCommit = this.publishStatus;

      const targetCommits = await new RepoSpeedBump(
        remoteCommit.commit
      ).check();

      if (targetCommits.length === 0) {
        return;
      }

      const projectFiles = new ProjectFiles(remoteCommit.commit);
      const { tracked, modified, added } = await projectFiles.files();

      const fileOids = new ModifiedFileOids(remoteCommit.commit.sha);
      const modifiedFiles = await fileOids.create(modified);

      const oldFiles = modifiedFiles.map((file: any) => file.oldPath);
      const allFiles = await new GetAllProjectFiles().target();
      await new ProjectTypeGenerator(oldFiles, allFiles).run();

      const updateFiles = { tracked, added, modified: modifiedFiles };
      const updateQueries = await new ProjectTypeParser(updateFiles).run();

      // need to handle newly added (tagged) files here

      await new PublishProjectUpdatedFiles(updateQueries.modified).run();
    } catch (err) {
      throw err;
    }
  };
}
