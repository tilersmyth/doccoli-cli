import * as nodegit from "nodegit";
import { NodeGit } from "../lib/NodeGit";
import { FileUtils } from "../utils/FileUtils";

/**
 * Get files updated since last publish
 */
export class GetUpdatedFiles {
  sha: string | null;

  constructor(sha: string | null) {
    this.sha = sha;
  }

  private async handleCommits(sha: string | null) {
    const lastCommit = await new NodeGit().lastCommit();
    return new Promise<nodegit.Commit[]>((resolve: any, reject: any) => {
      const commits: any = [];
      const eventEmitter: any = lastCommit.history();
      eventEmitter.on("commit", (commit: nodegit.Commit) => {
        commits.push(commit);

        if (commit.sha() === sha) eventEmitter.emit("end");
      });

      eventEmitter.on("end", () => resolve(commits));
      eventEmitter.on("error", (err: any) => reject(err));

      eventEmitter.start();
    });
  }

  private handlePatches = async (
    commits: nodegit.Commit[]
  ): Promise<nodegit.ConvenientPatch[]> => {
    const patchesArr: any = [];

    for (const commit of commits) {
      const diffList = await commit.getDiff();
      for (const diff of diffList) {
        const patches = await diff.patches();

        for (const patch of patches) {
          patchesArr.push(patch);
        }
      }
    }

    return patchesArr;
  };

  private handleFiles(filesArr: string[]) {
    // removes dupes, non .ts files, nonexistent paths
    return filesArr.filter(
      (e: any, i: number, a: any) =>
        a.findIndex((f: any) => f === e) === i &&
        e.indexOf(".ts") !== -1 &&
        FileUtils.fileExists(e)
    );
  }

  target = async () => {
    const commits = await this.handleCommits(this.sha);
    const files = await this.handlePatches(commits);

    const targetArr: any = [];
    for (const file of files) {
      targetArr.push(file.newFile().path());
    }

    return this.handleFiles(targetArr);
  };
}
