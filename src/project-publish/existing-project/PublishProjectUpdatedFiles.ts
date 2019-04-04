import { PublishApi } from "../../api/PublishApi";
import { IsoGit } from "../../lib/IsoGit";

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
      const commit = await this.iso.lastCommitSha();
      const branch = await this.iso.branch();

      // TESTING

      const test = this.updateQueries.updated[0];
      const file = test.file;

      const update = test.modified[0];

      console.log("FILE: ", file);
      console.log("UPDATE: ", update.query);

      // END TESTING

      // for (const update of this.updateQueries.updated) {
      //   console.log(`+++ ${update.file} +++`);

      //   for (const line of update.modified) {
      //     console.log(line);
      //   }
      // }
    } catch (err) {
      throw err;
    }
  };
}
