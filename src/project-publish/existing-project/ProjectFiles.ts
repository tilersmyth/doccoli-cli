import { LocalFiles } from "./LocalFiles";
import { TrackedFilesApi } from "../../api/TrackedFilesApi";

interface ProjectFilesUpdates {
  tracked: string[];
  modified: string[];
  added: string[];
}

export class ProjectFiles {
  private localSha: string;

  constructor(localSha: string) {
    this.localSha = localSha;
  }

  private fileFilter = (localFiles: string[], trackedFiles: string[]) => {
    return localFiles.filter((file: string) => trackedFiles.includes(file));
  };

  files = async (): Promise<ProjectFilesUpdates> => {
    // 1. Get all local (GIT) file updates
    const localFiles = await new LocalFiles(this.localSha).walk();

    const tracked = new TrackedFilesApi(this.localSha);
    // 2. Get all tracked (remote) files
    const trackedFiles = await tracked.get();

    // 3. Handle deleted files
    if (localFiles.deleted.length > 0) {
      const trackedDeleted = this.fileFilter(localFiles.deleted, trackedFiles);

      if (trackedDeleted.length > 0) {
        await tracked.delete(trackedDeleted);
      }
    }

    // 4. Determine tracked files that have been modified locally
    const trackedModified = this.fileFilter(localFiles.modified, trackedFiles);

    return {
      tracked: trackedFiles,
      modified: trackedModified,
      added: localFiles.added
    };
  };
}
