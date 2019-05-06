import gql from "graphql-tag";

import { Apollo } from "./Apollo";
import keytar from "../utils/keytar";
import { UndocFile } from "../utils/UndocFile";

export class TrackedFilesApi extends Apollo {
  commit: string;

  constructor(commit: string) {
    super();
    this.commit = commit;
  }

  async get(): Promise<any> {
    try {
      const token = await keytar.getToken();
      const config = await UndocFile.config();

      const operation = {
        query: gql`
          query FindAllFiles {
            findAllFiles {
              files
              error {
                path
                message
              }
            }
          }
        `,
        context: {
          headers: {
            Authorization: token,
            ProjectKey: config.key
          }
        }
      };

      const {
        findAllFiles: { files, error }
      } = await this.fetch(operation);

      if (error) {
        throw error;
      }

      return files;
    } catch (err) {
      throw err;
    }
  }

  async delete(files: string[]): Promise<any> {
    try {
      const token = await keytar.getToken();
      const config = await UndocFile.config();

      const operation = {
        query: gql`
          mutation DeleteFiles($files: [String!], $commit: String!) {
            deleteFiles(files: $files, commit: $commit) {
              success
              error {
                path
                message
              }
            }
          }
        `,
        variables: {
          files,
          commit: this.commit
        },
        context: {
          headers: {
            Authorization: token,
            ProjectKey: config.key
          }
        }
      };

      const {
        deleteFiles: { success, error }
      } = await this.fetch(operation);

      if (error) {
        throw error;
      }

      return success;
    } catch (err) {
      throw err;
    }
  }
}
