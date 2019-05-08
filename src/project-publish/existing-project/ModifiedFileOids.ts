import { IsoGit } from "../../lib/IsoGit";
import { FileUtils } from "../../utils/FileUtils";

import PublishEvents from "../../events/publish/Events";

interface ModifiedFile {
  path: string;
  oldOid: string;
}

/**
 * Bind file oid at last published commit to modified file array
 */
export class ModifiedFileOids extends IsoGit {
  commitSha: string;

  constructor(commitSha: string) {
    super();
    this.commitSha = commitSha;
  }

  private targetCommits = async (): Promise<string[]> => {
    try {
      const commits = await this.git().log({
        dir: IsoGit.dir
      });

      const shas: string[] = [];
      for (const commit of commits) {
        // switch back after
        shas.push(commit.oid!);
        if (commit.oid === this.commitSha) {
          return shas.reverse();
        }
      }

      throw "unable to locate last published commit";
    } catch (err) {
      throw err;
    }
  };

  private createFileEvent = () => {
    PublishEvents.emitter(
      "existingFiles_createMod",
      "Creating modified files at last oid"
    );
  };

  bind = async (file: string): Promise<ModifiedFile> => {
    const fileObj: ModifiedFile = { path: file, oldOid: "" };
    const git = this.git();
    const commits = await this.targetCommits();
    let lastFileSha = null;

    for (const commit of commits) {
      const fileObject = await git.readObject({
        dir: IsoGit.dir,
        oid: commit,
        filepath: fileObj.path
      });

      if (fileObject.oid !== lastFileSha) {
        if (lastFileSha !== null) {
          // Set to initial oid
          if (!fileObj.oldOid) {
            fileObj.oldOid = lastFileSha;
          }
        }
        lastFileSha = fileObject.oid;
      }
    }

    return fileObj;
  };

  private createFile = async (file: ModifiedFile) => {
    const { object: blob } = await this.git().readObject({
      dir: IsoGit.dir,
      oid: file.oldOid,
      encoding: "utf8"
    });

    return FileUtils.createFile(
      `.undoc/temp/${file.oldOid}.ts`,
      (blob as Buffer).toString("utf8")
    );
  };

  create = async (files: ModifiedFile[]) => {
    if (files.length === 0) {
      return [];
    }

    PublishEvents.emitter(
      "existingFiles_createMod",
      "Creating modified files at last oid"
    );

    return Promise.all(files.map(this.createFile));
  };
}
