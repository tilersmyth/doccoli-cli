import * as jsDiff from "diff";

export class JsDiffHunk {
  static async parse(hunk: jsDiff.Hunk) {
    return new Promise((resolve: any) => {
      let lineNo: number = hunk.newStart;
      let oldNo: number = 0;
      const lines = hunk.lines;
      const hunkArr: any = [];
      for (let i = 0; i < lines.length; i++) {
        const origin = lines[i].substring(0, 1).trim();
        const newLineNo = origin === "-" ? -1 : lineNo;
        const content = lines[i].substring(1);

        if (newLineNo > -1) {
          lineNo++;
        }

        if (newLineNo < 0) {
          const lastOrigin = lines[i - 1].substring(0, 1).trim();
          if (lastOrigin === "-") {
            oldNo++;
          } else {
            oldNo = lineNo;
          }
        }

        const oldLineNo = newLineNo > -1 ? -1 : oldNo;

        if (!origin) {
          continue;
        }

        hunkArr.push({ origin, newLineNo, oldLineNo, content });
      }

      resolve(hunkArr);
    });
  }
}
