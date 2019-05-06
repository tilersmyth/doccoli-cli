import { UndocFile } from "../utils/UndocFile";
import PublishEvents from "../events/publish/Events";

interface ModifiedFile {
  path: string;
  oldOid: string;
}

interface ParserFiles {
  tracked: string[];
  added: string[];
  modified: ModifiedFile[];
}

/**
 * Json doc parser
 */
export class ProjectTypeParser {
  files: ParserFiles;

  constructor(files: ParserFiles) {
    this.files = files;
  }

  private async selectParser(events: any) {
    try {
      const configFile = await UndocFile.config();
      switch (configFile.language) {
        case "typescript":
          return await require("@undoc/ts-parse").parse(events, this.files);
        default:
          throw "invalid target type";
      }
    } catch (err) {
      throw err;
    }
  }

  async run() {
    try {
      return await this.selectParser(PublishEvents.emitter);
    } catch (err) {
      throw err;
    }
  }
}
