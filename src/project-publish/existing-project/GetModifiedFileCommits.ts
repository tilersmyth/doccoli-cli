import * as git from "isomorphic-git";

import { IsoGit } from "../../lib/IsoGit";

interface ModifiedFiles {
  path: string;
  commits: string[];
}

export class GetModifiedFileCommits {
  isoGit: IsoGit;
  sha: string;
  modifiedFiles: string[];
  commitsThatMatter: string[] = [];

  constructor(sha: string, modifiedFiles: string[]) {
    this.isoGit = new IsoGit();
    this.sha = sha;
    this.modifiedFiles = modifiedFiles;
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

  async run() {
    const git = this.isoGit.git();
    const commits = await git.log({
      dir: IsoGit.dir
    });

    this.commitsThatMatter = this.findCommitsThatMatter(commits);
    console.log(`${this.commitsThatMatter.length} commits since last publish`);

    return Promise.all<ModifiedFiles>(this.modifiedFiles.map(this.mapFiles));
  }
}
