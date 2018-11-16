import chalk from "chalk";

import { readFile } from "./files";

export const undocConfig = async () => {
  try {
    const file = await readFile(`${process.cwd()}/.undoc/config.json`);

    if (!file) {
      console.log(chalk.red("Error reading Undoc config file"));
      return null;
    }

    const parsedFile = JSON.parse(file);

    if (!parsedFile.key) {
      console.log(chalk.red("Key field is missing from  config file"));
      return null;
    }

    if (!parsedFile.name) {
      console.log(chalk.red("Name field is missing from  config file"));
      return null;
    }

    return parsedFile;
  } catch (err) {
    console.log(chalk.red("Error reading Undoc config file"));
    return null;
  }
};

export const npmVersion = async () => {
  const packageFile: any = await readFile(`${process.cwd()}/package.json`);

  if (!packageFile) {
    console.log(chalk.red("Error reading package.json file"));
    return null;
  }

  return JSON.parse(packageFile).version;
};
