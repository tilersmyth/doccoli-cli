import { GetUpdatedFiles } from "./GetUpdatedFiles";
import { UpdateFilesApi } from "../../api/UpdateFilesApi";

/**
 * Get existing project files - including those that are updated
 */
export class GetExistingProjectFiles {
  sha: string;

  constructor(sha: string) {
    this.sha = sha;
  }

  private updatedFiles(modifiedFiles: any, trackedFiles: any) {
    return trackedFiles.reduce(
      (acc: any, file: any) =>
        modifiedFiles.find((f: any) => f.path === file.path)
          ? [...acc, file.path]
          : acc,
      []
    );
  }

  private updatedFilesBySha(modifiedFiles: any, trackedFiles: any) {
    return modifiedFiles.reduce((acc: any, file: any) => {
      if (trackedFiles.indexOf(file.path) > -1) {
        const index = acc.findIndex((val: any) => val.sha === file.sha);

        index > -1
          ? acc[index].files.push(file.path)
          : acc.push({ sha: file.sha, files: [file.path] });
      }
      return acc;
    }, []);
  }

  run = async (): Promise<{ update: []; files: [] }> => {
    const files = await new GetUpdatedFiles(this.sha).target();

    // no modified files
    if (files[3].length === 0) {
      return { update: [], files: files[1] };
    }

    const trackedFiles = await new UpdateFilesApi(files[0], files[2]).results();
    const updatedFiles = this.updatedFiles(files[3], trackedFiles);

    // no tracked files have been updated
    if (updatedFiles.length === 0) {
      return { update: [], files: files[1] };
    }

    // add to file paths for generator
    files[1] = [...files[1], ...updatedFiles];

    const updatedFilesBySha = this.updatedFilesBySha(files[3], updatedFiles);

    return { update: updatedFilesBySha, files: files[1] };
  };
}
