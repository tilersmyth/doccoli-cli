import { LastCommitApi } from "../api/LastCommitApi";

import { IsoGit } from "../lib/IsoGit";

import { CliLastCommit_cliLastCommit } from "../types/schema";

/**
 * Get the commit sha that was most recently published
 */
export class GetLastPublishedSha {
  run = async (): Promise<any> => {
    try {
      const iso = new IsoGit();
      const branch = await iso.git().currentBranch({
        dir: IsoGit.dir,
        fullname: false
      });

      if (!branch) {
        throw "Unable to determine current branch";
      }

      const results = await new LastCommitApi(branch).results();

      return results;
    } catch (err) {
      throw err;
    }
  };
}
