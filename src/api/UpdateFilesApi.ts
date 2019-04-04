import gql from "graphql-tag";

import { Apollo } from "./Apollo";
import keytar from "../utils/keytar";
import { UndocFile } from "../utils/UndocFile";

export class UpdateFilesApi {
  commitSha: string;
  modified: string[];
  deleted: string[];

  constructor(commitSha: string, modified: string[], deleted: string[]) {
    this.commitSha = commitSha;
    this.modified = modified;
    this.deleted = deleted;
  }

  async results(): Promise<any> {
    try {
      const token = await keytar.getToken();
      const config = await UndocFile.config();

      const operation = {
        query: gql`
          mutation updateAndFindAll(
            $commitSha: String!
            $modified: [String!]
            $deleted: [String!]
          ) {
            updateAndFindAll(
              commitSha: $commitSha
              modified: $modified
              deleted: $deleted
            ) {
              files {
                path
              }
              error {
                path
                message
              }
            }
          }
        `,
        variables: {
          commitSha: this.commitSha,
          modified: this.modified,
          deleted: this.deleted
        },
        context: {
          headers: {
            Authorization: token,
            ProjectKey: config.key
          }
        }
      };

      const {
        updateAndFindAll: { files, error }
      } = await new Apollo(operation).fetch();

      if (error) {
        throw error;
      }

      return files;
    } catch (err) {
      throw err;
    }
  }
}
