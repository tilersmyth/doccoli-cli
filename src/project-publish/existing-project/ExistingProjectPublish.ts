import { RepoSpeedBump } from "./RepoSpeedBump";
import { FileTree } from "../FileTree";
import { GetAllProjectFiles } from "../new-project/GetAllProjectFiles";
import { ProjectTypeGenerator } from "../../project-type/ProjectTypeGenerator";
import { ProjectTypeParser } from "../../project-type/ProjectTypeParser";
import { PublishProjectUpdatedFiles } from "./PublishProjectUpdatedFiles";
import { ProjectFiles } from "./ProjectFiles";
import { ModifiedFileOids } from "./ModifiedFileOids";

import PublishEvents from "../../events/publish/Events";

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

      const localFiles = await new FileTree(
        true,
        remoteCommit.commit.sha
      ).walk();

      const projectFiles = new ProjectFiles(localFiles);
      const { tracked, modified, added } = await projectFiles.files();

      const fileOids = new ModifiedFileOids(remoteCommit.commit.sha);
      const modifiedFiles = await fileOids.create(modified);

      const oldFiles = modifiedFiles.map((file: any) => file.oldPath);
      const allFiles = await new GetAllProjectFiles().target();
      await new ProjectTypeGenerator(oldFiles, allFiles).run();

      const updateFiles = { tracked, added, modified: modifiedFiles };
      const updateQueries = await new ProjectTypeParser(updateFiles).run();

      // need to handle newly added (tagged) files here
      PublishEvents.emitter("push_new_publish", "Pushing nodes to server");
      await new PublishProjectUpdatedFiles(updateQueries.modified)
        .run()
        .catch((err: any) => {
          throw err;
        });

      PublishEvents.emitter("complete_new_publish", "Publish successful!");
    } catch (err) {
      throw err;
    }
  };
}
