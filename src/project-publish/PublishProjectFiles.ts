import { PublishApi } from "../api/PublishApi";
import { NodeGit } from "../lib/NodeGit";

import keytar from "../utils/keytar";
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

      await new PublishApi(token).results(
        "446bc00c-a1a8-48d3-8595-8e217b59167b",
        this.files[0],
        { sha: commit.sha(), branch },
        { size: 4, index: 0 }
      );

      // for (const file of this.files) {
      //   await new PublishApi(token).results(file, commit.sha(), branch);
      // }
    } catch (err) {
      throw err;
    }
  };
}
