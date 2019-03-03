import { UndocFile } from "../utils/UndocFile";
import PublishEvents from "../events/publish/Events";

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

  private async selectGenerator(undocEvents: any) {
    try {
      const configFile = await UndocFile.config();

      switch (configFile.target) {
        case "typescript":
          return await require("@undoc/ts-gen").generate(
            undocEvents,
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

  async run() {
    try {
      return await this.selectGenerator(PublishEvents.emitter);
    } catch (err) {
      throw err;
    }
  }
}
