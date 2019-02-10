export interface ModifiedFile {
  path: string;
  oldOid: string;
  newOid: string;
}

export interface ColDetail {
  colNo: number;
  colSize: number;
}

export interface LineDiffDetail {
  type: string;
  lineNo: number;
  cols: ColDetail[];
  addedContent: string;
  removedContent: string;
}
