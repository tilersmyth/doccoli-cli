import { PublishApi } from "../../api/PublishApi";
import { IsoGit } from "../../lib/IsoGit";

import { CommentApi } from "../../api/publish-update/CommentApi";
import { PublishUpdateApi } from "../../api/publish-update/PublishUpdateApi";

/**
 * Publish project files to server
 */
export class PublishProjectUpdatedFiles {
  updateQueries: any = [];
  iso: IsoGit;

  constructor(updateQueries: any) {
    this.updateQueries = updateQueries;
    this.iso = new IsoGit();
  }

  run = async (): Promise<void> => {
    try {
      const sha = await this.iso.lastCommitSha();
      const branch = await this.iso.branch();

      const publish = this.updateQueries;

      for (let i = 0; i < publish.length; i++) {
        await new PublishUpdateApi({ sha, branch }, "", publish[i], {
          nodesPublished: i + 1,
          nodesTotal: publish.length
        }).results();
      }

      return;
    } catch (err) {
      throw err;
    }
  };
}
