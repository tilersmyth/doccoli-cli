import { UndocFile } from "../utils/UndocFile";

/**
 * Json doc generator
 */
export class ProjectTypeGenerator {
  files: string[];

  constructor(files: string[]) {
    this.files = files;
  }

  async run() {
    try {
      const configFile = await UndocFile.config();
      switch (configFile.target) {
        case "typescript":
          return await require("@undoc/ts-gen").generate(this.files);
        default:
          throw "invalid target type";
      }
    } catch (err) {
      throw err;
    }
  }
}
