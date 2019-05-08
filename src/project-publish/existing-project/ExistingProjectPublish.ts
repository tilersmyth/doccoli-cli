import * as moment from "moment";

import { IsoGit } from "../../lib/IsoGit";
import { ProjectTypeGenerator } from "../../project-type/ProjectTypeGenerator";
import { ProjectTypeParser } from "../../project-type/ProjectTypeParser";
import { PublishProjectUpdatedFiles } from "./PublishProjectUpdatedFiles";
import { ProjectFiles } from "./ProjectFiles";
import { ModifiedFileOids } from "./ModifiedFileOids";

import PublishEvents from "../../events/publish/Events";

/**
 * Existing project publish
 */
export class ExistingProjectPublish extends IsoGit {
  publishStatus: any;

  constructor(publishStatus: any) {
    super();
    this.publishStatus = publishStatus;
  }

  private static shortSha(sha: string) {
    return sha.substring(0, 6);
  }

  private publishInitEvent = async (remoteCommit: any) => {
    const localCommit = await this.commit();
    const localSha = ExistingProjectPublish.shortSha(localCommit.sha);
    PublishEvents.emitter(
      "existing_publish",
      `Publishing update [${localCommit.branch} ${localSha}]`
    );

    const remoteSha = ExistingProjectPublish.shortSha(remoteCommit.sha);

    PublishEvents.emitter(
      "existing_last_commit",
      `Last published: [${remoteSha}] ${moment(
        remoteCommit.createdAt
      ).fromNow()}`
    );
  };

  run = async (): Promise<void> => {
    try {
      const remoteCommit = this.publishStatus.commit;

      await this.publishInitEvent(remoteCommit);

      const projectFiles = new ProjectFiles(remoteCommit);
      const { tracked, modified, added } = await projectFiles.files();

      const fileOids = new ModifiedFileOids(remoteCommit.sha);
      const modifiedByOid = await Promise.all(modified.map(fileOids.bind));
      const oldFiles = await fileOids.create(modifiedByOid);

      const newFiles = [...added, ...modified];
      await new ProjectTypeGenerator(oldFiles, newFiles).run();

      const updateFiles = { tracked, added, modified: modifiedByOid };
      const updateQueries = await new ProjectTypeParser(updateFiles).run();

      // need to handle newly added (tagged) files here

      // await new PublishProjectUpdatedFiles(updateQueries.modified).run();
    } catch (err) {
      throw err;
    }
  };
}
