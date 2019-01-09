import * as nodegit from "nodegit";
import { NodeGit } from "../../lib/NodeGit";

interface Update {
  sha: string;
  files: string[];
}

interface LineChanges {
  file: string;
  lines: number[];
}

interface FileCommits {
  [key: string]: nodegit.Oid[];
}

/**
 * Use updated file paths and SHAs to get line updates
 */
export class GetLineUpdates {
  update: Update[];
  lineChanges: LineChanges[] = [];
  fileCommits: FileCommits = {};

  constructor(update: Update[]) {
    this.update = update;
  }

  private async diffList(commit: nodegit.Commit) {
    return await commit.getDiff();
  }

  private async patches(diff: nodegit.Diff) {
    return await diff.patches();
  }

  private async hunks(patch: nodegit.ConvenientPatch) {
    return await patch.hunks();
  }

  private async lines(hunk: nodegit.ConvenientHunk) {
    return await hunk.lines();
  }

  private handleLines(fileName: string, lines: nodegit.DiffLine[]) {
    const index = this.lineChanges.findIndex(
      (lines: any) => lines.file === fileName
    );
    const newLines: number[] = [];

    // if new file, push line
    if (index < 0) {
      for (const line of lines) {
        const newLineno = line.newLineno();
        if (newLineno > 0 && String.fromCharCode(line.origin()) === "+") {
          newLines.push(newLineno);
        }
      }

      this.lineChanges.push({
        file: fileName,
        lines: newLines
      });
      return;
    }

    // file exists in line changes
    const existingLines = this.lineChanges[index].lines;

    for (const line of lines) {
      // If net add, increment all greater lines
      if (line.oldLineno() < 0) {
        for (let existingLine of existingLines) {
          if (line.newLineno() < existingLine) {
            existingLine++;
          }
        }
      }

      // If net sub, decrement all greater lines
      if (line.newLineno() < 0) {
        for (let existingLine of existingLines) {
          if (line.oldLineno() < existingLine) {
            existingLine--;
          }
        }
      }

      // If add (inc net add), push to list if !exist
      if (
        line.newLineno() > -1 &&
        existingLines.indexOf(line.newLineno()) < 0 &&
        String.fromCharCode(line.origin()) === "+"
      ) {
        newLines.push(line.newLineno());
      }
    }
    existingLines.push(...newLines);
  }

  private isNewCommit(
    patch: nodegit.ConvenientPatch,
    commit: nodegit.Commit
  ): boolean {
    const commitOid = nodegit.Oid.fromString(commit.sha());

    if (!this.fileCommits[patch.newFile().path()]) {
      this.fileCommits[patch.newFile().path()] = [commitOid];
      return true;
    }

    for (const parent of commit.parents()) {
      if (this.fileCommits[patch.newFile().path()].indexOf(parent)) {
        return false;
      }
    }

    this.fileCommits[patch.newFile().path()].push(commitOid);
    return true;
  }

  private async lineUpdates(commit: nodegit.Commit, files: any) {
    const diffList = await this.diffList(commit);
    for (const diff of diffList) {
      const patches = await this.patches(diff);

      for (const patch of patches) {
        if (files.indexOf(patch.newFile().path()) > -1) {
          // Check if commit's parents include a commit
          // that was already processed
          const isNewCommit = this.isNewCommit(patch, commit);
          if (!isNewCommit) {
            break;
          }

          const hunks = await this.hunks(patch);

          for (const hunk of hunks) {
            const lines = await this.lines(hunk);
            this.handleLines(patch.newFile().path(), lines);
          }
        }
      }
    }
  }

  run = async (): Promise<LineChanges[]> => {
    for (const update of this.update) {
      const commit = await new NodeGit().commitBySha(update.sha);
      await this.lineUpdates(commit, update.files);
    }

    return this.lineChanges;
  };
}
