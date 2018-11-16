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

  branch = async () => {
    return await this.command("git rev-parse --abbrev-ref HEAD");
  };

  initialCommit = async (): Promise<string> => {
    return await this.command("git rev-list --max-parents=0 HEAD");
  };

  latestCommitSha = async (): Promise<string> => {
    const branch = await this.branch();
    return await this.command(`git rev-parse origin/${branch}`);
  };

  fileChanges = async (sha?: string) => {
    const newSha = await this.latestCommitSha();
    const oldSha = sha || (await this.initialCommit());

    return await this.command(
      `git diff --name-only ${oldSha.trim()} ${newSha.trim()}`
    );
  };
}
