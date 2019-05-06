import { IsoGit } from "../../lib/IsoGit";

/**
 * Get files updated since last publish
 */
export class LocalFiles extends IsoGit {
  sha: string;

  constructor(sha: string) {
    super();
    this.sha = sha;
  }

  private walkReduce(acc: any, row: any) {
    const FILE = 0,
      HEAD = 1,
      STAGING = 3;

    const addedIndex = acc.added.indexOf(row[FILE]);
    const deletedIndex = acc.deleted.indexOf(row[FILE]);
    const modifiedIndex = acc.modified.indexOf(row[FILE]);

    // Added
    if (row[HEAD] === 0 && row[STAGING] === 2 && addedIndex < 0)
      return {
        ...acc,
        added: [...acc.added, row[FILE]]
      };

    // Deleted
    if (row[STAGING] === 0 && deletedIndex < 0) {
      // Remove if in Added
      if (addedIndex > -1) {
        acc.added.splice(addedIndex, 1);
      }
      // Remove if in Modified
      if (modifiedIndex > -1) {
        acc.modified.splice(modifiedIndex, 1);
      }
      // Add to deleted
      return {
        ...acc,
        deleted: [...acc.deleted, row[FILE]]
      };
    }

    // Modified
    if (row[HEAD] !== row[STAGING] && modifiedIndex < 0) {
      if (addedIndex > -1) {
        // Do nothing if in added
        return acc;
      }

      return {
        ...acc,
        modified: [...acc.modified, row[FILE]]
      };
    }

    return acc;
  }

  walk = async () => {
    const git: any = this.git();

    const fileObj: any = {
      added: [],
      deleted: [],
      modified: []
    };

    const dir = IsoGit.dir,
      pattern = "src/**",
      ref = this.sha;

    return (await git.statusMatrix({
      dir,
      pattern,
      ref
    })).reduce(this.walkReduce, fileObj);
  };
}
