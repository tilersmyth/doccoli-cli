import * as fs from "fs";

export const readDir = (filePath: string) => fs.existsSync(filePath);

export const createDir = (filePath: string) => fs.mkdirSync(filePath);

export const readFile = (filePath: string): Promise<string> =>
  new Promise(resolve => {
    return fs.readFile(filePath, "utf-8", (_, data) => {
      resolve(data);
    });
  });

export const writeFile = (filePath: string, values: string) =>
  new Promise((resolve, reject) => {
    fs.writeFile(filePath, values, { flag: "w" }, async err => {
      if (err) reject(err);

      const file = await readFile(filePath);

      resolve(file);
    });
  });
