import { LastCommitApi } from "../api/LastCommitApi";

import { Nodegit } from "../lib/Nodegit";
import keytar from "../utils/keytar";
import { undocConfig } from "../utils/configFile";

import { CliLastCommit_cliLastCommit } from "../types/schema";

/**
 * Get the commit sha that was most recently published
 */
export class GetLastPublishedSha {
  run = async (): Promise<CliLastCommit_cliLastCommit | null> => {
    try {
      const token = await keytar.getToken();
      const config = await undocConfig();
      const branch = await new Nodegit().branch();

      return await new LastCommitApi(token).results(config.key, branch);
    } catch (err) {
      throw err;
    }
  };
}
