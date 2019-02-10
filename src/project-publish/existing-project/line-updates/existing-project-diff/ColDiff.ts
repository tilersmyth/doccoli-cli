import * as jsDiff from "diff";
import { ColDetail } from "../../types";

export class ColDiff {
  oldContent: string;
  newContent: string;

  constructor(oldContent: string, newContent: string) {
    this.oldContent = oldContent;
    this.newContent = newContent;
  }

  updates() {
    try {
      const diffChars = jsDiff.diffChars(this.oldContent, this.newContent);

      const untouchedCols: ColDetail[] = [];
      let charInc: number = 0;
      let addedContent: string = "";
      let removedContent: string = "";
      let isModified: boolean = false;

      for (const char of diffChars) {
        if (char.count === undefined) {
          throw "Diff string count undefined";
        }

        // Increment no action columns if has content
        if (!char.added && !char.removed && char.value.trim()) {
          untouchedCols.push({
            colNo: charInc,
            colSize: char.count
          });
        }

        if (!char.added) {
          removedContent += char.value;
        }

        if (!char.removed) {
          charInc += char.count;
          addedContent += char.value;
        }

        // Determine if udpated content is consequential
        if ((char.removed || char.added) && char.value.trim()) {
          isModified = true;
        }
      }

      return {
        cols: untouchedCols,
        isModified,
        removedContent,
        addedContent
      };
    } catch (e) {
      throw e;
    }
  }
}
