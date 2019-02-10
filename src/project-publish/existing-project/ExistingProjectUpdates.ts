import { GetFileUpdates, ExcludeFormattingUpdates } from "./line-updates";
import { ModifiedFile, LineDiffDetail } from "./types";

interface UpdatesDetail {
  file: string;
  lines: LineDiffDetail[];
}

export class ExistingProjectUpdates {
  modifiedFiles: ModifiedFile[];

  constructor(modifiedFiles: ModifiedFile[]) {
    this.modifiedFiles = modifiedFiles;
  }

  private mapFiles = async (file: ModifiedFile): Promise<UpdatesDetail> => {
    const hunks = await new GetFileUpdates(file).hunks();
    const lines = new ExcludeFormattingUpdates(file.path, hunks).remove();

    return { file: file.path, lines };
  };

  async files(): Promise<UpdatesDetail[]> {
    return Promise.all(this.modifiedFiles.map(this.mapFiles));
  }
}
