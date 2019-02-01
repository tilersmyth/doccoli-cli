import { GetUpdatedFiles } from "./GetUpdatedFiles";
import { UpdateFilesApi } from "../../api/UpdateFilesApi";

interface ModifiedFiles {
  path: string;
  commits?: string[];
}

/**
 * Get existing project files - including those that are updated
 */
export class GetExistingProjectFiles {
  sha: string;

  constructor(sha: string) {
    this.sha = sha;
  }

  run = async (): Promise<{
    all: string[];
    modified: string[];
  }> => {
    const files = await new GetUpdatedFiles(this.sha).walk();

    // If no deletions and no modified files
    if (files.deleted.length === 0 && files.modified.length === 0) {
      return { all: files.added, modified: [] };
    }

    // Files modified locally that exist remotely (tracked)
    const modifiedTrackedFiles = await new UpdateFilesApi(
      files.modified,
      files.deleted
    ).results();

    // Merge added and modified for JSON generation (while keeping another list with modified tracked)
    const allFiles = [...files.added, ...files.modified];

    // no tracked files have been updated, return added
    if (modifiedTrackedFiles.length === 0) {
      return { all: allFiles, modified: [] };
    }

    const modified = modifiedTrackedFiles.map((file: any) => file.path);

    return { all: allFiles, modified };
  };
}
