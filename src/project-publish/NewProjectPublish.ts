import { NewPublishSpeedBump } from "./NewPublishSpeedBump";
import { GetUpdatedFiles } from "./GetUpdatedFiles";
import { TypeDoc } from "../lib/TypeDoc";

/**
 * New project publish
 */
export class NewProjectPublish {
  run = async (): Promise<void> => {
    try {
      await new NewPublishSpeedBump().run();
      const files = await new GetUpdatedFiles(null).target();
      await new TypeDoc(files).generate();
    } catch (err) {
      throw err;
    }
  };
}
