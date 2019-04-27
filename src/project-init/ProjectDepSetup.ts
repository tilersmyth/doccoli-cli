import { UndocFile } from "../utils/UndocFile";

/**
 * Setup fields for chosen type
 */
export class ProjectDepSetup {
  async run() {
    try {
      const configFile = await UndocFile.config();
      switch (configFile.language) {
        case "typescript":
          return await require("@undoc/ts-gen").setup();
        default:
          throw "invalid target type";
      }
    } catch (err) {
      throw err;
    }
  }
}
