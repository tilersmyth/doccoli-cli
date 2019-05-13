import { IsoGit } from "../../lib/IsoGit";
import { FileUtils } from "../../utils/FileUtils";

import PublishEvents from "../../events/publish/Events";

interface ModifiedFile {
  path: string;
  oldPath: string;
}

/**
 * Bind file oid at last published commit to modified file array
 */
export class ModifiedFileOids extends IsoGit {
  constructor(private remoteSha: string) {
    super();
    this.remoteSha = remoteSha;
  }

  private map = async (path: string): Promise<ModifiedFile> => {
    const file = await this.git().readObject({
      dir: IsoGit.dir,
      oid: this.remoteSha,
      filepath: path,
      encoding: "utf8"
    });

    const oldPath = await FileUtils.createFile(
      `.undoc/temp/${file.oid}.ts`,
      (file.object as Buffer).toString("utf8")
    );

    return { path, oldPath };
  };

  create = async (modified: string[]): Promise<ModifiedFile[]> => {
    PublishEvents.emitter(
      "existingFiles_createMod",
      "Creating prior version of modified files"
    );

    return Promise.all(modified.map(this.map));
  };
}
