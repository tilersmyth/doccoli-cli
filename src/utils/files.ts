import * as fs from "fs";

export const readDir = (filePath: string) => fs.existsSync(filePath);

export const createDir = (filePath: string) => fs.mkdirSync(filePath);

export const readFile = (filePath: string): Promise<string> => {
  try {
    return new Promise((resolve, reject) => {
      return fs.readFile(filePath, "utf-8", (err, data) => {
        if (err) reject(err);

        resolve(data);
      });
    });
  } catch (err) {
    throw err;
  }
};

export const writeFile = (filePath: string, values: string) => {
  try {
    return new Promise((resolve, reject) => {
      fs.writeFile(filePath, values, { flag: "w" }, async err => {
        if (err) reject(err);

        const file = await readFile(filePath);

        resolve(file);
      });
    });
  } catch (err) {
    throw err;
  }
};
