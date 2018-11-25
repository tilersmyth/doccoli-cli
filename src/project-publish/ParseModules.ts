import chalk from "chalk";
import { JSONStream } from "../lib/JSONStream";
import { ParseUtils } from "./ParseUtils";

/**
 * Parse modules in generated TypeDoc file
 */
export class ParseModules {
  private handler(data: any, cb: any) {
    const children = data.filter((o: any) => o.flags.isPublic);
    const test = ParseUtils.findRecursive("children", [], { children }, null);
    cb(test);
  }

  async run() {
    console.log(chalk.white("Extracting modules"));
    const test = await new JSONStream("children.*.children").parser(
      this.handler
    );
    // console.log(test);
  }
}
