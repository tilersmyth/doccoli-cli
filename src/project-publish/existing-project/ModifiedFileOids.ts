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
  constructor(private commits: string[]) {
    super();
    this.commits = commits;
  }

  bind = async (file: string): Promise<ModifiedFile> => {
    const fileObj: ModifiedFile = { path: file, oldOid: "" };
    let lastFileSha = null;

    for (const commit of this.commits) {
      const fileObject = await this.git().readObject({
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
