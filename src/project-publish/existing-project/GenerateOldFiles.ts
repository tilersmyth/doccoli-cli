import { IsoGit } from "../../lib/IsoGit";
import { FileUtils } from "../../utils/FileUtils";

export class GenerateOldFiles {
  oldOids: any;
  private isoGit: IsoGit;

  constructor(oldOids: any) {
    this.oldOids = oldOids;
    this.isoGit = new IsoGit();
  }

  async create(): Promise<string[]> {
    const git = this.isoGit.git();

    const oldFiles: string[] = [];
    for (const file of this.oldOids) {
      const { object: blob } = await git.readObject({
        dir: IsoGit.dir,
        oid: file.oldOid,
        encoding: "utf8"
      });

      const filePath = await FileUtils.createFile(
        `.undoc/temp/${file.oldOid}.ts`,
        (blob as Buffer).toString("utf8")
      );

      oldFiles.push(filePath);
    }

    return oldFiles;
  }
}
