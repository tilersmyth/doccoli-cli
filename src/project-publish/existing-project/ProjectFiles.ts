import { LocalFiles } from "./LocalFiles";
import { TrackedFilesApi } from "../../api/TrackedFilesApi";

import PublishEvents from "../../events/publish/Events";

interface ProjectFilesUpdates {
  tracked: string[];
  modified: string[];
  added: string[];
}

export class ProjectFiles {
  private localCommit: any;

  constructor(localCommit: any) {
    this.localCommit = localCommit;
  }

  private fileFilter = (localFiles: string[], trackedFiles: string[]) => {
    return localFiles.filter((file: string) => trackedFiles.includes(file));
  };

  private initEvent = () => {
    PublishEvents.emitter(
      "existingFiles_init",
      "Looking for updates to file tree"
    );
  };

  private localFilesEvent = (localFiles: any) => {
    const added = localFiles.added.length;
    const modified = localFiles.modified.length;
    const deleted = localFiles.deleted.length;

    PublishEvents.emitter(
      "existingFiles_local",
      `Local: ${added} added, ${modified} modified, ${deleted} deleted`
    );
  };

  private trackedFilesEvent = (modified: any, deleted: any) => {
    PublishEvents.emitter(
      "existingFiles_tracked",
      `Tracked: ${modified.length} modified, ${deleted.length} deleted`
    );
  };

  files = async (): Promise<ProjectFilesUpdates> => {
    this.initEvent();

    // 1. Get all local (GIT) file updates
    const localFiles = await new LocalFiles(this.localCommit.sha).walk();

    this.localFilesEvent(localFiles);

    const tracked = new TrackedFilesApi(this.localCommit);
    // 2. Get all tracked (remote) files
    const trackedFiles = await tracked.get();

    // 3. Handle deleted files
    const trackedDeleted = this.fileFilter(localFiles.deleted, trackedFiles);
    if (trackedDeleted.length > 0) {
      await tracked.delete(trackedDeleted);
    }

    // 4. Determine tracked files that have been modified locally
    const trackedModified = this.fileFilter(localFiles.modified, trackedFiles);

    this.trackedFilesEvent(trackedModified, trackedDeleted);

    return {
      tracked: trackedFiles,
      modified: trackedModified,
      added: localFiles.added
    };
  };
}
