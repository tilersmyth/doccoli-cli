import { GetLineUpdates } from "./GetLineUpdates";
import { ModifiedFile, FileLineUpdates } from "./types";
import { PrettyFilePath } from "../../utils/PrettyFilePath";

import PublishEvents from "../../events/publish/Events";

export class ExistingProjectUpdates {
  modifiedFiles: ModifiedFile[];

  constructor(modifiedFiles: ModifiedFile[]) {
    this.modifiedFiles = modifiedFiles;
  }

  private mapFiles = async (file: ModifiedFile): Promise<FileLineUpdates> => {
    const lines = await new GetLineUpdates(file).hunks();

    const filePath = new PrettyFilePath(file.path);

    const context = `${filePath.prettify()} [+${lines.added.length}, -${
      lines.removed.length
    }, \u2605${lines.modified.length}]`;

    PublishEvents.emitter("isogit_line_detail", context);

    return { file: file.path, lines };
  };

  async files(): Promise<FileLineUpdates[]> {
    return Promise.all(this.modifiedFiles.map(this.mapFiles));
  }
}
