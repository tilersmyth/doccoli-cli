import chalk from "chalk";

import { readFile } from "./files";

export default async () => {
  try {
    const file = await readFile(`${process.cwd()}/.undoc/config.json`);

    if (!file) {
      console.log(chalk.red("Error reading Undoc config file"));
      return null;
    }

    const parsedFile = JSON.parse(file);

    if (!parsedFile.key) {
      console.log(chalk.red("Undoc project key not found in config file"));
      return null;
    }

    return parsedFile;
  } catch (err) {
    console.log(chalk.red("Error reading Undoc config file"));
    return null;
  }
};
