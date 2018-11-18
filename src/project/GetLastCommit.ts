import { LastCommitApi } from "../api/LastCommitApi";

import { Commits } from "../git/Commits";

import keytar from "../utils/keytar";
import { undocConfig } from "../utils/configFile";

import { CliLastCommit_cliLastCommit } from "../types/schema";

/**
 * Get last commit that was published
 */
export class GetLastCommit {
  run = async (): Promise<CliLastCommit_cliLastCommit | null> => {
    try {
      const token = await keytar.getToken();
      const config = await undocConfig();
      const branch = await new Commits().branch();

      return await new LastCommitApi(token).results(config.key, branch);
    } catch (err) {
      throw err;
    }
  };
}
