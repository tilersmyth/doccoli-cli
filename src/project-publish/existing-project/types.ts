export interface ModifiedFile {
  path: string;
  oldOid: string;
  newOid: string;
}

export interface CharCol {
  colStart: number;
  colEnd: number;
}

interface ModifiedLine {
  lineNo: number;
  exclude: CharCol[];
}

interface LineUpdateTypes {
  added: number[];
  removed: number[];
  modified: ModifiedLine[];
}

export interface FileLineUpdates {
  file: string;
  lines: LineUpdateTypes;
}
