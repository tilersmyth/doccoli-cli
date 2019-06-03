import { PublishApi } from "../../api/PublishApi";
import { IsoGit } from "../../lib/IsoGit";

import { PublishUpdateApi } from "../../api/PublishUpdateApi";

/**
 * Publish project files to server
 */
export class PublishProjectUpdatedFiles {
  iso: IsoGit;

  constructor(private files: any) {
    this.files = files;
    this.iso = new IsoGit();
  }

  run = async (): Promise<any> => {
    const sha = await this.iso.lastCommitSha();
    const branch = await this.iso.branch();

    const publish = new PublishUpdateApi({ sha, branch }, "");

    return Promise.all(
      this.files.map(async (file: any, index: number) => {
        const progress = {
          published: index + 1,
          total: this.files.length
        };

        await publish.results(file, progress);
      })
    );
  };
}
