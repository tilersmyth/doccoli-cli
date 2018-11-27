import { UndocFile } from "../utils/UndocFile";

/**
 * Utils for determining new project dependency requirements
 */
export class ProjectTypeDeps {
  private async target() {
    try {
      const file = await UndocFile.config();
      return file.target;
    } catch (err) {
      throw err;
    }
  }

  // Setup for addtional options
  async generator() {
    try {
      switch (await this.target()) {
        case "typescript":
          return "@undoc/ts-gen";
        default:
          throw "invalid target type";
      }
    } catch (err) {
      throw err;
    }
  }

  async parser() {
    try {
      switch (await this.target()) {
        case "typescript":
          return "@undoc/ts-parse";
        default:
          throw "invalid target type";
      }
    } catch (err) {
      throw err;
    }
  }
}
