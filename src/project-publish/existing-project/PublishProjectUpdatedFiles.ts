import { PublishApi } from "../../api/PublishApi";
import { IsoGit } from "../../lib/IsoGit";

/**
 * Publish project files to server
 */
export class PublishProjectUpdatedFiles {
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

      for (const files of this.files) {
        console.log(files.file);
        for (const update of files.updates) {
          console.log(update);
        }
        // await new PublishApi(
        //   this.files[i],
        //   { sha: commit, branch },
        //   { size: this.files.length, index: i + 1 }
        // ).results();
      }
    } catch (err) {
      throw err;
    }
  };
}
