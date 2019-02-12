export interface ModifiedFile {
  path: string;
  oldOid: string;
  newOid: string;
}

export interface ColChunk {
  start: number;
  end: number;
}

export interface LineDiffDetail {
  type: string;
  lineNo: number;
  cols: ColChunk[];
  addedContent: string;
  removedContent: string;
}
