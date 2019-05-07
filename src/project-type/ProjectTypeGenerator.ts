import { UndocFile } from "../utils/UndocFile";
import PublishEvents from "../events/publish/Events";

/**
 * Json doc generator
 */
export class ProjectTypeGenerator {
  oldFiles: string[];
  allFiles: string[];

  constructor(oldFiles: string[], allFiles: string[]) {
    this.oldFiles = oldFiles;
    this.allFiles = allFiles;
  }

  private async selectGenerator(undocEvents: any) {
    try {
      const configFile = await UndocFile.config();

      switch (configFile.language) {
        case "typescript":
          return await require("@undoc/ts-gen").generate(
            undocEvents,
            this.oldFiles,
            this.allFiles
          );
        default:
          throw "invalid target type";
      }
    } catch (err) {
      throw err;
    }
  }

  async run() {
    try {
      return await this.selectGenerator(PublishEvents.emitter);
    } catch (err) {
      throw err;
    }
  }
}
