import * as typedoc from "typedoc";
import * as yup from "yup";

import { FileUtils } from "../utils/FileUtils";
import { UndocFiles } from "../utils/UndocFiles";

export class TypeDoc {
  files: string[];

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
      excludeExternals: yup.boolean().required(),
      excludePrivate: yup.boolean().required(),
      excludeProtected: yup.boolean().required(),
      hideGenerator: yup.boolean().required(),
      stripInternal: yup.boolean().required()
    });
  }

  generate = async () => {
    return new Promise(async (resolve, reject) => {
      const tdFile = await UndocFiles.typedoc();
      const schema = TypeDoc.schema();

      const validTdFile = await schema.isValid(tdFile);

      if (!validTdFile) {
        reject("typedoc (td.json) file schema invalid");
        return;
      }

      const app = new typedoc.Application(tdFile);

      const rootDir = FileUtils.rootDirectory();
      const done = app.generateJson(this.files, `${rootDir}/.undoc/docs.json`);

      resolve(done);
    });
  };
}
