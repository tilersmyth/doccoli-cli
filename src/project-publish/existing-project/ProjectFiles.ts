import { TrackedFilesApi } from "../../api/TrackedFilesApi";

import PublishEvents from "../../events/publish/Events";

interface ProjectFilesUpdates {
  tracked: string[];
  modified: string[];
  added: string[];
}

export class ProjectFiles {
  constructor(private localFiles: any) {
    this.localFiles = localFiles;
  }

  private fileFilter = (localFiles: string[], trackedFiles: string[]) => {
    return localFiles.filter((file: string) => trackedFiles.includes(file));
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
    try {
      this.localFilesEvent(this.localFiles);

      const tracked = new TrackedFilesApi();
      // 2. Get all tracked (remote) files
      const trackedFiles = await tracked.get();

      // 3. Handle deleted files
      const trackedDeleted = this.fileFilter(
        this.localFiles.deleted,
        trackedFiles
      );
      if (trackedDeleted.length > 0) {
        await tracked.delete(trackedDeleted);
      }

      // 4. Determine tracked files that have been modified locally
      const trackedModified = this.fileFilter(
        this.localFiles.modified,
        trackedFiles
      );

      this.trackedFilesEvent(trackedModified, trackedDeleted);

      return {
        tracked: trackedFiles,
        modified: trackedModified,
        added: this.localFiles.added
      };
    } catch (err) {
      throw err;
    }
  };
}
