import { UndocFile } from "../utils/UndocFile";
import PublishEvents from "../events/publish/Events";

/**
 * Json doc generator
 */
export class ProjectTypeGenerator {
  addedFiles: string[];
  modifiedFiles: string[];

  constructor(addedFiles: string[], modifiedFiles: string[]) {
    this.addedFiles = addedFiles;
    this.modifiedFiles = modifiedFiles;
  }

  private async selectGenerator(undocEvents: any) {
    try {
      const configFile = await UndocFile.config();

      switch (configFile.target) {
        case "typescript":
          return await require("@undoc/ts-gen").generate(
            undocEvents,
            this.addedFiles,
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
