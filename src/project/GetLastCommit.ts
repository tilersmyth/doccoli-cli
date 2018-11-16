import { LastCommitApi } from "../api/LastCommitApi";

import keytar from "../utils/keytar";
import configFile from "../utils/configFile";

import { CliLastCommit_cliLastCommit } from "../types/schema";

/**
 * Get last commit that was published
 */
export class GetLastCommit {
  run = async (): Promise<CliLastCommit_cliLastCommit | null> => {
    const token = await keytar.getToken();

    if (!token) {
      return null;
    }

    const config = await configFile();

    if (!config) {
      return null;
    }

    return await new LastCommitApi(token).results(config.key);
  };
}
