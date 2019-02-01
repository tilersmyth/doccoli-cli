import * as git from "isomorphic-git";

import { GetUpdatedFiles } from "./GetUpdatedFiles";
import { UpdateFilesApi } from "../../api/UpdateFilesApi";
import { IsoGit } from "../../lib/IsoGit";

interface ModifiedFiles {
  path: string;
  commits: string[];
}

/**
 * Get existing project files - including those that are updated
 */
export class ExistingProjectFiles {
  private sha: string;
  private isoGit: IsoGit;
  private commitsThatMatter: string[] = [];

  constructor(sha: string) {
    this.sha = sha;
    this.isoGit = new IsoGit();
  }

  private findCommitsThatMatter(commits: git.CommitDescription[]): string[] {
    try {
      const shas: string[] = [];
      for (const commit of commits) {
        shas.push(commit.oid!);
        if (commit.oid === this.sha) {
          return shas.reverse();
        }
      }

      throw "unable to locate last published commit";
    } catch (err) {
      throw err;
    }
  }

  private mapFiles = async (file: string): Promise<ModifiedFiles> => {
    const fileObj: ModifiedFiles = { path: file, commits: [] };
    const git = this.isoGit.git();
    const commits = this.commitsThatMatter;
    let lastFileSha = null;
    let lastCommitSha = null;
    for (const commit of commits) {
      const fileObject = await git.readObject({
        dir: IsoGit.dir,
        oid: commit,
        filepath: fileObj.path
      });

      if (fileObject.oid !== lastFileSha) {
        if (lastFileSha !== null) {
          fileObj.commits.unshift(lastCommitSha!);
        }
        lastFileSha = fileObject.oid;
      }
      lastCommitSha = commit;
    }
    return fileObj;
  };

  get = async (): Promise<{
    all: string[];
    modified: string[];
  }> => {
    const files = await new GetUpdatedFiles(this.sha).walk();

    // If no deletions and no modified files
    if (files.deleted.length === 0 && files.modified.length === 0) {
      return { all: files.added, modified: [] };
    }

    // Files modified locally that exist remotely (tracked)
    const modifiedTrackedFiles = await new UpdateFilesApi(
      files.modified,
      files.deleted
    ).results();

    // Merge added and modified for JSON generation (while keeping another list with modified tracked)
    const allFiles = [...files.added, ...files.modified];

    // no tracked files have been updated, return added
    if (modifiedTrackedFiles.length === 0) {
      return { all: allFiles, modified: [] };
    }

    const modified = modifiedTrackedFiles.map((file: any) => file.path);

    return { all: allFiles, modified };
  };

  getModifiedWithCommits = async (modifiedFiles: string[]) => {
    const git = this.isoGit.git();
    const commits = await git.log({
      dir: IsoGit.dir
    });

    this.commitsThatMatter = this.findCommitsThatMatter(commits);
    console.log(`${this.commitsThatMatter.length} commits since last publish`);

    return Promise.all<ModifiedFiles>(modifiedFiles.map(this.mapFiles));
  };
}
