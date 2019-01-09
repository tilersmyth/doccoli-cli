import { LastCommitApi } from "../api/LastCommitApi";

import { NodeGit } from "../lib/NodeGit";

import { CliLastCommit_cliLastCommit } from "../types/schema";

/**
 * Get the commit sha that was most recently published
 */
export class GetLastPublishedSha {
  run = async (): Promise<CliLastCommit_cliLastCommit | null> => {
    try {
      const branch = await new NodeGit().branch();
      return await new LastCommitApi(branch).results();
    } catch (err) {
      throw err;
    }
  };
}
