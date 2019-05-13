import { CommitSpeedBump } from "./CommitSpeedBump";
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

      const targetCommits = await new CommitSpeedBump(
        remoteCommit.commit
      ).check();

      if (targetCommits.length === 0) {
        return;
      }

      const projectFiles = new ProjectFiles(remoteCommit.commit);
      const { tracked, modified, added } = await projectFiles.files();

      const fileOids = new ModifiedFileOids(targetCommits);
      const modifiedByOid = await Promise.all(modified.map(fileOids.bind));
      const oldFiles = await fileOids.create(modifiedByOid);

      const allFiles = await new GetAllProjectFiles().target();
      await new ProjectTypeGenerator(oldFiles, allFiles).run();

      const updateFiles = { tracked, added, modified: modifiedByOid };
      const updateQueries = await new ProjectTypeParser(updateFiles).run();

      // need to handle newly added (tagged) files here

      await new PublishProjectUpdatedFiles(updateQueries.modified).run();
    } catch (err) {
      throw err;
    }
  };
}
