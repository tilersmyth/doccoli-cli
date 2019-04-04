import { PublishApi } from "../api/PublishApi";
import { IsoGit } from "../lib/IsoGit";

/**
 * Publish project files to server
 */
export class PublishProjectFiles {
  files: any = [];
  iso: IsoGit;

  constructor(files: any) {
    this.files = files;
    this.iso = new IsoGit();
  }

  run = async (): Promise<void> => {
    try {
      const commit = await this.iso.lastCommitSha();
      const branch = await this.iso.branch();

      for (let i = 0; i < this.files.length; i++) {
        await new PublishApi(
          this.files[i],
          { sha: commit, branch },
          { nodesTotal: this.files.length, nodesPublished: i + 1 }
        ).results();
      }
    } catch (err) {
      throw err;
    }
  };
}
