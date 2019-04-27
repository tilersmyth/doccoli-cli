import { UndocFile } from "../utils/UndocFile";
import PublishEvents from "../events/publish/Events";
import { IsoGit } from "../lib/IsoGit";

/**
 * Json doc parser
 */
export class ProjectTypeParser {
  addedFiles: string[];
  modifiedFiles: string[];

  constructor(addedFiles: string[], modifiedFileUpdateDetail?: any) {
    this.addedFiles = addedFiles;
    this.modifiedFiles = modifiedFileUpdateDetail;
  }

  private async selectParser(events: any) {
    const iso = new IsoGit();
    const sha = await iso.lastCommitSha();

    try {
      const configFile = await UndocFile.config();
      switch (configFile.language) {
        case "typescript":
          if (this.modifiedFiles) {
            return await require("@undoc/ts-parse").parseUpdate(
              events,
              this.addedFiles,
              this.modifiedFiles
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
