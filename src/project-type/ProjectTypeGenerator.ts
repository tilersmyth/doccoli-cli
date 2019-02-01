import { UndocFile } from "../utils/UndocFile";

/**
 * Json doc generator
 */
export class ProjectTypeGenerator {
  files: string[];
  modifiedFiles: string[];

  constructor(files: string[], modifiedFiles: string[]) {
    this.files = files;
    this.modifiedFiles = modifiedFiles;
  }

  async run() {
    try {
      const configFile = await UndocFile.config();
      switch (configFile.target) {
        case "typescript":
          return await require("@undoc/ts-gen").generate(
            this.files,
            this.modifiedFiles
          );
        default:
          throw "invalid target type";
      }
    } catch (err) {
      throw err;
    }
  }
}
