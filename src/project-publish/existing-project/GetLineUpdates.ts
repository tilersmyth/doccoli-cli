import * as jsDiff from "diff";
import * as stringSimilarity from "string-similarity";

import { IsoGit } from "../../lib/IsoGit";
import { ModifiedFile, CharCol } from "./types";

interface CharResult {
  index: number;
  exclude: CharCol[];
}

export class GetLineUpdates {
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

  private charsExist(acc: CharResult, char: jsDiff.Change) {
    if (!char.removed && !char.added) {
      acc.exclude.push({
        colStart: acc.index,
        colEnd: acc.index + char.count!
      });
    }

    if (!char.removed) {
      acc.index += char.count!;
    }

    return acc;
  }

  private lineSimilarity(adedContent: string, removedContent: string) {
    const similarity = stringSimilarity.compareTwoStrings(
      removedContent,
      adedContent
    );

    return similarity > 0.5;
  }

  private lineReducer = (acc: any, line: string) => {
    const origin = line.substring(0, 1).trim();
    const content = line.substring(1);

    if (origin === "-") {
      acc.removedContent.push(content.trim());
      acc.removed.push(acc.oldLineNo);
      acc.oldLineNo++;
    }

    if (origin === "+") {
      if (acc.removed.length === 0) {
        acc.added.push(acc.newLineNo);
        acc.newLineNo++;
        return acc;
      }

      // Eliminate formatting changes
      const removedIndex = acc.removedContent.findIndex(
        (removedContent: string) => removedContent.includes(content.trim())
      );

      if (removedIndex > -1) {
        acc.removedContent[removedIndex] = acc.removedContent[
          removedIndex
        ].replace(content.trim(), "");

        if (!acc.removedContent[removedIndex].trim()) {
          acc.notRemoved.push(acc.removed[removedIndex]);
        }

        acc.newLineNo++;
        return acc;
      }

      // Find modified lines
      const similarityIndex = acc.removedContent.findIndex(
        this.lineSimilarity.bind(null, content.trim())
      );

      // Lines are modified
      if (similarityIndex > -1) {
        // Find chars in line that have not been modified to
        // avoid recursively searching for references unnecessarily
        const diffChars = jsDiff.diffChars(
          acc.removedContent[similarityIndex],
          content.trim()
        );

        const diffCharsResult: any = {
          index: content.search(/\S/) + 1,
          exclude: []
        };

        const excludeChars = diffChars.reduce(this.charsExist, diffCharsResult);

        acc.modified.push({
          lineNo: acc.newLineNo,
          exclude: excludeChars.exclude
        });

        acc.notRemoved.push(acc.removed[similarityIndex]);
        acc.newLineNo++;
        return acc;
      }

      acc.added.push(acc.newLineNo);
      acc.newLineNo++;
    }

    return acc;
  };

  private removeFilter(notRemoved: number[], line: number) {
    return !notRemoved.includes(line);
  }

  private hunkReducer = (acc: any, hunk: jsDiff.Hunk) => {
    const lineResults: any = {
      newLineNo: hunk.newStart,
      oldLineNo: hunk.oldStart,
      removedContent: [],
      notRemoved: [],
      removed: [],
      added: [],
      modified: []
    };

    const line = hunk.lines.reduce(this.lineReducer, lineResults);

    if (line.added.length > 0) {
      acc.added.push(...line.added);
    }

    if (line.modified.length > 0) {
      acc.modified.push(...line.modified);
    }

    if (line.notRemoved.length > 0) {
      line.removed = line.removed.filter(
        this.removeFilter.bind(null, line.notRemoved)
      );
    }

    if (line.removed.length > 0) {
      acc.removed.push(...line.removed);
    }

    return acc;
  };

  async hunks() {
    const { oldOid, newOid, path } = this.modifiedFile;

    const oldBlob = await this.fileObject(oldOid);
    const newBlob = await this.fileObject(newOid);

    const { hunks } = jsDiff.structuredPatch(
      path,
      path,
      oldBlob,
      newBlob,
      "",
      "",
      { context: 0 }
    );

    const hunkResults: any = {
      removed: [],
      added: [],
      modified: []
    };

    return hunks.reduce(this.hunkReducer, hunkResults);
  }
}
