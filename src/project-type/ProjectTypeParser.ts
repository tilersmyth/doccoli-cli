import { UndocFile } from "../utils/UndocFile";

/**
 * Json doc parser
 */
export class ProjectTypeParser {
  async run() {
    try {
      const configFile = await UndocFile.config();
      switch (configFile.target) {
        case "typescript":
          return await require("@undoc/ts-parse").parseNew();
        default:
          throw "invalid target type";
      }
    } catch (err) {
      throw err;
    }
  }
}
