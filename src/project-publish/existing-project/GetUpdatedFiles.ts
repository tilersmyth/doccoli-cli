import * as path from "path";
import * as nodegit from "nodegit";
import { NodeGit } from "../../lib/NodeGit";

/**
 * Get files updated since last publish
 */
export class GetUpdatedFiles {
  sha: string;

  constructor(sha: string) {
    this.sha = sha;
  }

  private async handleCommits(sha: string) {
    const lastCommit = await new NodeGit().lastCommit();
    return new Promise<nodegit.Commit[]>((resolve: any, reject: any) => {
      const commits: any = [];
      const eventEmitter: any = lastCommit.history();
      eventEmitter.on("commit", (commit: nodegit.Commit) => {
        if (commit.sha() === sha) {
          eventEmitter.emit("end").end();
        }
        commits.unshift(commit);
      });

      eventEmitter.on("end", () => {
        resolve(commits);
      });

      eventEmitter.on("error", (err: any) => reject(err));

      eventEmitter.start();
    });
  }

  private handlePatches = async (
    commits: nodegit.Commit[]
  ): Promise<[{ sha: string; file: nodegit.ConvenientPatch }]> => {
    const patchesArr: any = [];

    for (const commit of commits) {
      const diffList = await commit.getDiff();
      for (const diff of diffList) {
        const patches = await diff.patches();
        for (const patch of patches) {
          patchesArr.push({ sha: commit.sha(), file: patch });
        }
      }
    }

    return patchesArr;
  };

  private fileRenames(acc: any, file: nodegit.ConvenientPatch): void {
    // File rename logic: if exising (already in acc array) "new" path
    // equals incoming "old" path then replace existing "new" with
    // incoming "new"
    if (file.isRenamed()) {
      if (acc[0]) {
        const valExists = acc[0].findIndex((v: any) => {
          return v.new === file.oldFile().path();
        });

        if (valExists > -1) {
          acc[0][valExists].new = file.newFile().path();
          return;
        }
      }

      (acc[0] = acc[0] || []).push({
        old: file.oldFile().path(),
        new: file.newFile().path()
      });
    }
    return;
  }

  private groupFiles(
    patches: [
      {
        sha: string;
        file: nodegit.ConvenientPatch;
      }
    ]
  ): any {
    return patches
      .filter(
        (patch: any) =>
          path.extname(patch.file.newFile().path()) === ".ts" &&
          patch.file
            .newFile()
            .path()
            .startsWith("src/")
      )
      .reduce(
        (acc: any, patch: { sha: string; file: nodegit.ConvenientPatch }) => {
          // 0 - renamed
          // 1 - added
          // 2 - deleted
          // 3 - modified

          // handle file renames
          this.fileRenames(acc, patch.file);

          // Avoid dupes
          if (
            acc[patch.file.status()] &&
            acc[patch.file.status()].indexOf(patch.file.newFile().path()) > -1
          ) {
            return acc;
          }

          (acc[patch.file.status()] = acc[patch.file.status()] || []).push(
            patch.file.status() === 3
              ? {
                  sha: patch.sha,
                  path: patch.file.newFile().path()
                }
              : patch.file.newFile().path()
          );

          return acc;
        },
        {}
      );
  }

  target = async () => {
    const commits = await this.handleCommits(this.sha);
    const patches = await this.handlePatches(commits);

    return this.groupFiles(patches);
  };
}
