import * as fs from "fs";
import * as git from "isomorphic-git";

import { FileUtils } from "../utils/FileUtils";

export class IsoGit {
  constructor() {
    git.plugins.set("fs", fs);
  }

  static dir = FileUtils.root();

  async branch() {
    return await git.currentBranch({
      dir: IsoGit.dir,
      fullname: false
    });
  }

  fs() {
    return fs;
  }

  git() {
    return git;
  }
}
