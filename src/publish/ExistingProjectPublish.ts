import { CliLastCommit_cliLastCommit } from "../types/schema";

/**
 * Existing project publish
 */
export class ExistingProjectPublish {
  commit: CliLastCommit_cliLastCommit;

  constructor(commit: CliLastCommit_cliLastCommit) {
    this.commit = commit;
  }

  run = async (): Promise<void> => {
    try {
      console.log("EXISTING PUBLISH");
    } catch (err) {
      throw err;
    }
  };
}
