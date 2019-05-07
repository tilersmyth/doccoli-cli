import * as fs from "fs";
import * as git from "isomorphic-git";

import { FileUtils } from "../utils/FileUtils";

export class IsoGit {
  constructor() {
    git.plugins.set("fs", fs);
  }

  static dir = FileUtils.root();

  async branch() {
    try {
      const branch = await git.currentBranch({
        dir: IsoGit.dir,
        fullname: false
      });

      if (!branch) {
        throw "Unable to determine commit branch";
      }

      return branch;
    } catch (err) {
      throw err;
    }
  }

  async lastCommitSha(): Promise<string> {
    try {
      const commits = await git.log({ dir: IsoGit.dir, depth: 1 });

      if (!commits[0] || !commits[0].oid) {
        throw "Unable to get last commit";
      }

      return commits[0].oid;
    } catch (err) {
      throw err;
    }
  }

  async commit(): Promise<{ sha: string; branch: string }> {
    try {
      const sha = await this.lastCommitSha();
      const branch = await this.branch();
      return { sha, branch };
    } catch (err) {
      throw err;
    }
  }

  fs() {
    return fs;
  }

  git() {
    return git;
  }
}
