/**
 * Parse utils
 */
export class ParseUtils {
  static findRecursive(
    key: string,
    resultsArr: any,
    moduleArr: any,
    parent: any
  ) {
    const results: any = [];

    if (moduleArr instanceof Array) {
      for (const moduleObj of moduleArr) {
        ParseUtils.findRecursive(key, resultsArr, moduleObj, parent);
        continue;
      }
    } else {
      for (const prop in moduleArr) {
        if (prop === key) {
          moduleArr[prop].map((m: any) => (m.parent = parent));
          parent = moduleArr.children[0].name;
          results.push(...moduleArr.children);
          ParseUtils.findRecursive(key, resultsArr, moduleArr.children, parent);
          break;
        }

        if (
          moduleArr[prop] instanceof Object ||
          moduleArr[prop] instanceof Array
        ) {
          ParseUtils.findRecursive(key, resultsArr, moduleArr[prop], parent);
          continue;
        }
      }
    }

    if (results.length > 0) {
      resultsArr.push(...results);
    }

    return resultsArr;
  }
}
