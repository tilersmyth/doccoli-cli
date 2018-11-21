import * as typedoc from "typedoc";
import * as yup from "yup";
import chalk from "chalk";
import * as readline from "readline";

import { FileUtils } from "../utils/FileUtils";
import { UndocFiles } from "../utils/UndocFiles";

export class TypeDoc {
  files: string[];
  tdReviewCount: number = 1;

  constructor(files: string[]) {
    this.files = files;
  }

  private static schema() {
    return yup.object().shape({
      mode: yup.string().required(),
      json: yup.string().required(),
      module: yup.string().required(),
      logger: yup.string().required(),
      target: yup.string().required(),
      ignoreCompilerErrors: yup.boolean().required(),
      excludePrivate: yup.boolean().required(),
      excludeProtected: yup.boolean().required(),
      hideGenerator: yup.boolean().required(),
      stripInternal: yup.boolean().required()
    });
  }

  private logger = (event: string) => {
    if (event === "begin") {
      console.log(chalk.white("Started TypeDoc compiling"));
    }

    if (event === "fileBegin") {
      const count = this.tdReviewCount++;
      const fileCount = this.files.length;

      readline.clearLine(process.stdout, 0);
      readline.cursorTo(process.stdout, 0);
      process.stdout.write(
        chalk.white(`Reviewing files ${(count / fileCount) * 100}%`)
      );
    }

    if (event === "resolveBegin") {
      console.log(chalk.white("\nResolving reflections"));
    }

    if (event === "end") {
      console.log(chalk.white("Finished TypeDoc compiling"));
    }
  };

  converter = (application: any) => {
    return new Promise(async (resolve, reject) => {
      try {
        application.converter.on("all", this.logger);

        const rootDir = FileUtils.rootDirectory();
        const done = application.generateJson(
          this.files,
          `${rootDir}/.undoc/docs.json`
        );

        resolve(done);
      } catch (err) {
        reject(err);
        return;
      }
    });
  };

  generate = async () => {
    const tdFile = await UndocFiles.typedoc();
    const schema = TypeDoc.schema();

    try {
      await schema.validate(tdFile);
    } catch (err) {
      throw `TypeDoc (td.json) file schema invalid:\n${err.message}`;
    }

    try {
      const app = new typedoc.Application(tdFile);
      const json = await this.converter(app);
      app.converter.off("all");
      return json;
    } catch (err) {
      throw err;
    }
  };
}
