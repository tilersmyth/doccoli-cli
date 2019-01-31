import { GetUpdatedFiles } from "./GetUpdatedFiles";
import { UpdateFilesApi } from "../../api/UpdateFilesApi";
import { GetModifiedFileCommits } from "./GetModifiedFileCommits";

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
    modified: ModifiedFiles[];
    all: string[];
  }> => {
    const files = await new GetUpdatedFiles(this.sha).walk();

    // If no deletions and no modified files
    if (files.deleted.length === 0 && files.modified.length === 0) {
      return { modified: [], all: files.added };
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
      return { modified: [], all: allFiles };
    }

    const modifiedFiles = await new GetModifiedFileCommits(
      this.sha,
      modifiedTrackedFiles
    ).run();

    return { modified: modifiedFiles, all: allFiles };
  };
}
