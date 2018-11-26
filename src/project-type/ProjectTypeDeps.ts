import { UndocFile } from "../utils/UndocFile";

/**
 * Utils for determining new project dependency requirements
 */
export class ProjectTypeDeps {
  // Setup for addtional options
  async generator() {
    try {
      const configFile = await UndocFile.config();
      switch (configFile.target) {
        case "typescript":
          return "@undoc/ts-gen";
        default:
          throw "invalid target type";
      }
    } catch (err) {
      throw err;
    }
  }

  // To do
  parser() {}
}
