import { UndocFile } from "../utils/UndocFile";
import PublishEvents from "../events/publish/Events";

import { LineDiffDetail } from "../project-publish/existing-project/types";

interface UpdatesDetail {
  file: string;
  lines: LineDiffDetail[];
}

/**
 * Json doc parser
 */
export class ProjectTypeParser {
  addedFiles: string[];
  modifiedFileUpdateDetail: UpdatesDetail[];

  constructor(addedFiles: string[], modifiedFileUpdateDetail?: any) {
    this.addedFiles = addedFiles;
    this.modifiedFileUpdateDetail = modifiedFileUpdateDetail;
  }

  private async selectParser(events: any) {
    try {
      const configFile = await UndocFile.config();
      switch (configFile.target) {
        case "typescript":
          if (this.modifiedFileUpdateDetail) {
            return await require("@undoc/ts-parse").parseUpdate(
              events,
              this.addedFiles,
              this.modifiedFileUpdateDetail
            );
          }
          return await require("@undoc/ts-parse").parseNew(
            events,
            this.addedFiles
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
      return await this.selectParser(PublishEvents.emitter);
    } catch (err) {
      throw err;
    }
  }
}
