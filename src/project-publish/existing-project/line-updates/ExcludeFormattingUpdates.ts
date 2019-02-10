import { LineDiffDetail } from "../types";

export class ExcludeFormattingUpdates {
  filePath: string;
  lines: LineDiffDetail[];
  consecutiveLineContent: LineDiffDetail[] = [];

  constructor(filePath: string, lines: LineDiffDetail[]) {
    this.filePath = filePath;
    this.lines = lines;
  }

  private reducer = (acc: any, line: LineDiffDetail) => {
    // Check if previous line exists
    const isLastLine = this.consecutiveLineContent.find(
      (csl: LineDiffDetail) => csl.lineNo + 1 === line.lineNo
    );

    // If not in sequence
    if (!isLastLine) {
      // Check in consecutiveLineContent for lines that have empty
      // added content and removed content
      const cslToRemove = this.consecutiveLineContent
        .filter(
          (csl: LineDiffDetail) =>
            !csl.addedContent.trim() && !csl.removedContent.trim()
        )
        .reduce((acc: any, csl: LineDiffDetail) => {
          csl && acc.push(csl.lineNo);
          return acc;
        }, []);

      // Add, by file path, to lines that should not be included in update
      if (cslToRemove.length > 0) {
        (acc[this.filePath] = acc[this.filePath] || []).push(...cslToRemove);
      }

      // reset content array
      this.consecutiveLineContent.length = 0;
    }

    // Trim up content
    const addedContent = line.addedContent.trim();
    const removedContent = line.removedContent.trim();

    if (line.type === "modified") {
      // If added content exists within removed content
      // then subtract it from removed and set added to empty
      if (line.removedContent.includes(addedContent)) {
        line.removedContent = removedContent.replace(addedContent, "");
        line.addedContent = "";
      }
    }

    // Check if added content matches previously removed content
    const consecutiveLineIndex = this.consecutiveLineContent.findIndex(
      (csl: LineDiffDetail) => csl.removedContent.includes(addedContent)
    );

    if (consecutiveLineIndex > -1) {
      // Chip away existing removed content
      this.consecutiveLineContent[
        consecutiveLineIndex
      ].removedContent = this.consecutiveLineContent[
        consecutiveLineIndex
      ].removedContent.replace(addedContent, "");

      // Remove current added content as it matched previously removed
      line.addedContent = "";
    }

    this.consecutiveLineContent.push(line);

    return acc;
  };

  private filter = (linesToRemove: any, line: LineDiffDetail): boolean => {
    return (
      !linesToRemove[this.filePath] ||
      !linesToRemove[this.filePath].includes(line.lineNo)
    );
  };

  remove(): LineDiffDetail[] {
    // Determines if modified lines are simply formatting
    // changes that should be removed from modified list
    const linesToRemove = this.lines.reduce(this.reducer, {});

    // If false positive modified then filter out
    return this.lines.filter(this.filter.bind(null, linesToRemove));
  }
}
