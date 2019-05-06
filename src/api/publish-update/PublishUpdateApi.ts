import gql from "graphql-tag";

import { Apollo } from "../Apollo";
import keytar from "../../utils/keytar";
import { UndocFile } from "../../utils/UndocFile";

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
          )
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
      const { cliPublishUpdate } = await this.fetch(operation);

      return cliPublishUpdate;
    } catch (err) {
      console.log(err.result);
      throw err;
    }
  }
}
