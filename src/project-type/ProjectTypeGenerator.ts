import { UndocFile } from "../utils/UndocFile";
import PublishEvents from "../events/publish/Events";

/**
 * Json doc generator
 */
export class ProjectTypeGenerator {
  allFiles: string[];
  isUpdate: boolean;

  constructor(allFiles: string[], isUpdate: boolean) {
    this.allFiles = allFiles;
    this.isUpdate = isUpdate;
  }

  private async selectGenerator(undocEvents: any) {
    try {
      const configFile = await UndocFile.config();

      switch (configFile.language) {
        case "typescript":
          return await require("@undoc/ts-gen").generate(
            undocEvents,
            this.allFiles,
            this.isUpdate
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
