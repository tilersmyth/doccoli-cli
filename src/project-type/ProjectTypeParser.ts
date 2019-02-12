import { UndocFile } from "../utils/UndocFile";

/**
 * Json doc parser
 */
export class ProjectTypeParser {
  updates: any;

  constructor(updates?: any) {
    this.updates = updates;
  }

  async run() {
    try {
      const configFile = await UndocFile.config();
      switch (configFile.target) {
        case "typescript":
          return await require("@undoc/ts-parse").parse(this.updates);
        default:
          throw "invalid target type";
      }
    } catch (err) {
      throw err;
    }
  }
}
