/**
 * Utils for determining new project dependency requirements
 */
export class InstallProjectDepsUtils {
  type: string;

  constructor(type: string) {
    this.type = type;
  }

  // Setup for addtional options
  generator() {
    switch (this.type) {
      case "typescript":
        return "@undoc/ts-gen";
      default:
        throw "invalid target type";
    }
  }
}
