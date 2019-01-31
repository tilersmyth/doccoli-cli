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

  private async lastCommit() {
    return await this.iso.git().fetch({
      dir: IsoGit.dir,
      depth: 1
    });
  }

  private async branch() {
    return await this.iso.git().currentBranch({
      dir: IsoGit.dir,
      fullname: false
    });
  }

  run = async (): Promise<void> => {
    try {
      const commit = await this.lastCommit();
      const branch = await this.branch();

      for (let i = 0; i < this.files.length; i++) {
        await new PublishApi(
          this.files[i],
          { sha: commit.fetchHead, branch },
          { size: this.files.length, index: i + 1 }
        ).results();
      }
    } catch (err) {
      throw err;
    }
  };
}
