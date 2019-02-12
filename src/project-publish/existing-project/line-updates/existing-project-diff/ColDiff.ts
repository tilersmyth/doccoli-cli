import * as jsDiff from "diff";
import { ColChunk } from "../../types";

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

      // Chunks of characters that are NO AFFECTED by update
      const colChunks: ColChunk[] = [];
      let charInc: number = 1;
      let addedContent: string = "";
      let removedContent: string = "";
      let isModified: boolean = false;

      for (const char of diffChars) {
        if (char.count === undefined) {
          throw "Diff string count undefined";
        }

        // Increment no action columns if not whitespace
        if (!char.added && !char.removed && char.value.trim()) {
          if (colChunks.length > 0) {
            const chunkIndex = colChunks.findIndex(
              (chunk: any) => charInc === chunk.end
            );

            if (chunkIndex > -1) {
              colChunks[chunkIndex].end = char.count + charInc;
              continue;
            }
          }
          colChunks.push({
            start: charInc,
            end: char.count + charInc
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
        cols: colChunks,
        isModified,
        removedContent,
        addedContent
      };
    } catch (e) {
      throw e;
    }
  }
}
