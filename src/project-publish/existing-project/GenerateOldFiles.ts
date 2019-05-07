import { IsoGit } from "../../lib/IsoGit";
import { FileUtils } from "../../utils/FileUtils";

interface ModifiedFile {
  path: string;
  oldOid: string;
}

export class GenerateOldFiles extends IsoGit {
  oldOids: ModifiedFile[];

  constructor(oldOids: ModifiedFile[]) {
    super();
    this.oldOids = oldOids;
  }

  private mapCreate = async (file: ModifiedFile) => {
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

  async create(): Promise<string[]> {
    return await Promise.all(this.oldOids.map(this.mapCreate));
  }
}
