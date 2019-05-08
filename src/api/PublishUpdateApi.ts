import gql from "graphql-tag";

import { Apollo } from "./Apollo";
import keytar from "../utils/keytar";
import { UndocFile } from "../utils/UndocFile";

export class PublishUpdateApi extends Apollo {
  commit: any;
  version: string;
  file: any;
  progress: any;

  constructor(commit: any, version: any, file: any, progress: any) {
    super();
    this.commit = commit;
    this.version = version;
    this.file = file;
    this.progress = progress;
  }

  async results(): Promise<any> {
    const token = await keytar.getToken();
    const config = await UndocFile.config();

    const operation = {
      query: gql`
        mutation CliPublishUpdate(
          $commit: ModuleCommit!
          $version: String!
          $file: FileUpdate!
          $progress: PublishProgress!
        ) {
          cliPublishUpdate(
            commit: $commit
            version: $version
            file: $file
            progress: $progress
          ) {
            success
            error {
              path
              message
            }
          }
        }
      `,
      variables: {
        commit: this.commit,
        version: this.version,
        file: this.file,
        progress: this.progress
      },
      context: {
        headers: {
          Authorization: token,
          ProjectKey: config.key
        }
      }
    };
    try {
      const {
        cliPublishUpdate: { success, error }
      } = await this.fetch(operation);

      if (error) {
        throw `Server error: ${error.message}`;
      }

      return success;
    } catch (err) {
      throw err;
    }
  }
}
