import { exec } from "child_process";

/**
 * Get git commit details
 */
export class Commits {
  private command(cmd: string): Promise<any> {
    return new Promise((resolve, reject) => {
      exec(cmd, (err, stdout) => {
        if (err) {
          reject(reject);
        }
        resolve(stdout);
      });
    });
  }

  branch = async (): Promise<string> => {
    try {
      const branch = await this.command("git rev-parse --abbrev-ref HEAD");
      return branch.trim();
    } catch (err) {
      throw err;
    }
  };

  initialCommit = async (): Promise<string> => {
    try {
      const commit = await this.command("git rev-list --max-parents=0 HEAD");
      return commit.trim();
    } catch (err) {
      throw err;
    }
  };

  latestCommitSha = async (): Promise<string> => {
    try {
      const branch = await this.branch();
      const commit = await this.command(`git rev-parse origin/${branch}`);
      return commit.trim();
    } catch (err) {
      throw err;
    }
  };

  fileChanges = async (sha?: string) => {
    try {
      const newSha = await this.latestCommitSha();
      const oldSha = sha || (await this.initialCommit());
      return await this.command(`git diff --name-only ${oldSha} ${newSha}`);
    } catch (err) {
      throw err;
    }
  };
}
