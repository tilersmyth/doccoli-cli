import { ColDiff } from "./ColDiff";
import { LineDiffDetail } from "../../types";

export class FileDiff {
  private static lineUpdateDetail(line: any): LineDiffDetail {
    return {
      lineNo: line.newLineNo < 0 ? line.oldLineNo : line.newLineNo,
      type: line.newLineNo < 0 ? "removed" : "added",
      cols: [],
      addedContent: line.newLineNo < 0 ? "" : line.content,
      removedContent: line.newLineNo < 0 ? line.content : ""
    };
  }

  private static modifiedLine(
    oldLine: LineDiffDetail,
    newLine: LineDiffDetail
  ): LineDiffDetail | null {
    const colDiff = new ColDiff(oldLine.removedContent, newLine.addedContent);

    const {
      cols,
      removedContent,
      addedContent,
      isModified
    } = colDiff.updates();

    if (!isModified) {
      return null;
    }

    return {
      ...newLine,
      type: "modified",
      cols,
      removedContent: removedContent,
      addedContent: addedContent
    };
  }

  static async updates(lines: any): Promise<LineDiffDetail[]> {
    return new Promise<LineDiffDetail[]>((resolve: any) => {
      const linesArr: LineDiffDetail[] = [];

      for (const line of lines) {
        const update = FileDiff.lineUpdateDetail(line);

        // Line removed
        if (update.type === "removed") {
          linesArr.push(update);
          continue;
        }

        const removedIndex = linesArr.findIndex(
          (l: LineDiffDetail) => l && l.lineNo === line.newLineNo
        );

        // Line added
        if (removedIndex < 0) {
          linesArr.push(update);
          continue;
        }

        // Line modified
        const modified = FileDiff.modifiedLine(linesArr[removedIndex], update);

        linesArr.splice(removedIndex, 1);

        // If modified is null then don't push as update
        // must be inconsequential like spacing change, etc.
        if (!modified) {
          continue;
        }

        linesArr.push(modified);
      }

      resolve(linesArr);
    });
  }
}
