import { LastCommitApi } from "../api/LastCommitApi";

import { IsoGit } from "../lib/IsoGit";

import { CliLastCommit_cliLastCommit } from "../types/schema";

/**
 * Get the commit sha that was most recently published
 */
export class GetLastPublishedSha {
  run = async (): Promise<CliLastCommit_cliLastCommit | null> => {
    try {
      const iso = new IsoGit();
      const branch = await iso.git().currentBranch({
        dir: IsoGit.dir,
        fullname: false
      });

      if (!branch) {
        throw "Unable to determine current branch";
      }

      return await new LastCommitApi(branch).results();
    } catch (err) {
      throw err;
    }
  };
}
