import { PublishApi } from "../api/PublishApi";
import { NodeGit } from "../lib/NodeGit";

import keytar from "../utils/keytar";
import { UndocFile } from "../utils/UndocFile";
/**
 * Publish project files to server
 */
export class PublishProjectFiles {
  files: any = [];

  constructor(files: any) {
    this.files = files;
  }

  run = async (): Promise<void> => {
    try {
      const token = await keytar.getToken();
      const git = new NodeGit();
      const commit = await git.lastCommit();
      const branch = await git.branch();
      const config = await UndocFile.config();

      for (let i = 0; i < this.files.length; i++) {
        await new PublishApi(token).results(
          config.key,
          this.files[i],
          { sha: commit.sha(), branch },
          { size: this.files.length, index: i + 1 }
        );
      }
    } catch (err) {
      throw err;
    }
  };
}
