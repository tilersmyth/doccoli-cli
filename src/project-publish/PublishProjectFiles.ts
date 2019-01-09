import { PublishApi } from "../api/PublishApi";
import { NodeGit } from "../lib/NodeGit";

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
      const git = new NodeGit();
      const commit = await git.lastCommit();
      const branch = await git.branch();

      for (let i = 0; i < this.files.length; i++) {
        await new PublishApi(
          this.files[i],
          { sha: commit.sha(), branch },
          { size: this.files.length, index: i + 1 }
        ).results();
      }
    } catch (err) {
      throw err;
    }
  };
}
