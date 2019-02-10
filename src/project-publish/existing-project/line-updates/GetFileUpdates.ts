import * as jsDiff from "diff";

import { IsoGit } from "../../../lib/IsoGit";
import { JsDiffHunk, FileDiff } from "./existing-project-diff";
import { ModifiedFile } from "../types";

export class GetFileUpdates {
  iso: IsoGit;
  modifiedFile: ModifiedFile;

  constructor(modifiedFile: ModifiedFile) {
    this.iso = new IsoGit();
    this.modifiedFile = modifiedFile;
  }

  private async fileObject(oid: string): Promise<string> {
    const git = this.iso.git();

    const { object: blob } = await git.readObject({
      dir: IsoGit.dir,
      oid
    });

    return (blob as Buffer).toString("utf8");
  }

  private async hunkReducer(acc: any, hunk: jsDiff.Hunk) {
    const lines = await JsDiffHunk.parse(hunk);
    const output = await FileDiff.updates(lines);
    const accumulator = await acc;

    return output.length > 0 ? [...accumulator, ...output] : accumulator;
  }

  async hunks() {
    const oldBlob = await this.fileObject(this.modifiedFile.oldOid);
    const newBlob = await this.fileObject(this.modifiedFile.newOid);

    const { hunks } = jsDiff.structuredPatch(
      this.modifiedFile.path,
      this.modifiedFile.path,
      oldBlob,
      newBlob
    );

    return hunks.reduce(this.hunkReducer, Promise.resolve([]));
  }
}
