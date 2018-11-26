import { LastCommitApi } from "../api/LastCommitApi";

import { NodeGit } from "../lib/NodeGit";
import keytar from "../utils/keytar";
import { UndocFile } from "../utils/UndocFile";

import { CliLastCommit_cliLastCommit } from "../types/schema";

/**
 * Get the commit sha that was most recently published
 */
export class GetLastPublishedSha {
  run = async (): Promise<CliLastCommit_cliLastCommit | null> => {
    try {
      const token = await keytar.getToken();
      const config = await UndocFile.config();
      const branch = await new NodeGit().branch();

      return await new LastCommitApi(token).results(config.key, branch);
    } catch (err) {
      throw err;
    }
  };
}
