import { FileUtils } from "../utils/FileUtils";
import PublishEvents from "../events/publish/Events";

export class PublishCleanup {
  async run() {
    PublishEvents.emitter("cleanup_workspace", "Cleaning up workspace");
    PublishEvents.emitter(
      "cleanup_workspace_dir",
      "Deleting ~/.undoc/temp directory"
    );
    await FileUtils.deleteDirectory(".undoc/temp");
  }
}
