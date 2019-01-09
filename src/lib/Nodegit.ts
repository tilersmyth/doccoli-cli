import * as nodegit from "nodegit";

export class NodeGit {
  private async repo(): Promise<nodegit.Repository> {
    try {
      const rootDir = process.cwd();
      return await nodegit.Repository.open(rootDir);
    } catch (err) {
      throw err;
    }
  }

  private ref = async (): Promise<nodegit.Reference> => {
    try {
      const repo = await this.repo();
      return await repo.getCurrentBranch();
    } catch (err) {
      throw err;
    }
  };

  branch = async (): Promise<string> => {
    try {
      const ref = await this.ref();
      return ref.shorthand();
    } catch (err) {
      throw err;
    }
  };

  lastCommit = async (): Promise<nodegit.Commit> => {
    try {
      const repo = await this.repo();
      const ref = await this.ref();
      return await repo.getBranchCommit(ref.shorthand());
    } catch (err) {
      throw err;
    }
  };

  getTree = async (): Promise<any> => {
    try {
      const lastCommit = await this.lastCommit();
      return lastCommit.getTree();
    } catch (err) {
      throw err;
    }
  };

  commitBySha = async (sha: string): Promise<nodegit.Commit> => {
    try {
      const repo = await this.repo();
      return await repo.getCommit(sha);
    } catch (err) {
      throw err;
    }
  };
}
