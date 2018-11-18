import { readFile } from "./files";

export const undocConfig = async () => {
  try {
    const file = await readFile(`${process.cwd()}/.undoc/config.json`);

    const parsedFile = JSON.parse(file);

    if (!parsedFile.key) {
      throw "Key field is missing from  config file";
    }

    if (!parsedFile.name) {
      throw "Name field is missing from  config file";
    }

    return parsedFile;
  } catch (err) {
    throw err;
  }
};

export const npmVersion = async () => {
  try {
    const packageFile: any = await readFile(`${process.cwd()}/package.json`);

    if (!packageFile) {
      throw "Unable to find package.json file";
    }

    return JSON.parse(packageFile).version;
  } catch (err) {
    throw err;
  }
};
