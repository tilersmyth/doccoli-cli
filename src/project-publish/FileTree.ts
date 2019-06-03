import { IsoGit } from "../lib/IsoGit";

import PublishEvents from "../events/publish/Events";

export class FileTree extends IsoGit {
  constructor(private isUpdate: boolean, private remoteSha?: string) {
    super();
    this.isUpdate = isUpdate;
    // Note: only required for existing publish
    this.remoteSha = remoteSha;
  }

  private fileTreeEvent = () => {
    const text = this.isUpdate
      ? "Looking for updates to file tree"
      : "Collecting files from file tree";

    PublishEvents.emitter("existingFiles_init", text);
  };

  private files = (acc: any, row: any) => {
    const FILE = 0,
      HEAD = 1,
      WORKDIR = 2,
      STAGING = 3;

    if (row[FILE].endsWith(".ts")) {
      acc.all = [...acc.all, row[FILE]];
    }

    // Check for unstaged changes
    if (row[WORKDIR] !== row[STAGING]) {
      return {
        ...acc,
        unstaged: [...acc.unstaged, row[FILE]]
      };
    }

    if (!this.isUpdate) {
      return acc;
    }

    const addedIndex = acc.added.indexOf(row[FILE]);
    const deletedIndex = acc.deleted.indexOf(row[FILE]);
    const modifiedIndex = acc.modified.indexOf(row[FILE]);

    // Added
    if (row[HEAD] === 0 && row[STAGING] === 2 && addedIndex < 0) {
      return {
        ...acc,
        added: [...acc.added, row[FILE]]
      };
    }

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
  };

  walk = async () => {
    try {
      this.fileTreeEvent();

      const fileTypes: any = {
        all: [],
        added: [],
        deleted: [],
        modified: [],
        unstaged: []
      };

      const localSha = await this.lastCommitSha();

      const dir = IsoGit.dir,
        pattern = "src/**",
        ref = this.isUpdate ? this.remoteSha : localSha;

      const statusMatrix = await this.git().statusMatrix({
        dir,
        pattern,
        ref
      });

      const files = statusMatrix.reduce(this.files, fileTypes);

      if (files.unstaged.length > 0) {
        throw "Cannot publish repository with unstaged changes.";
      }

      return files;
    } catch (err) {
      throw err;
    }
  };
}
