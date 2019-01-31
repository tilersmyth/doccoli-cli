import gql from "graphql-tag";

import { Apollo } from "./Apollo";
import keytar from "../utils/keytar";
import { UndocFile } from "../utils/UndocFile";

export class UpdateFilesApi {
  modified: string[];
  deletes: string[];

  constructor(modified: string[], deletes: string[]) {
    this.modified = modified;
    this.deletes = deletes;
  }

  async results(): Promise<any> {
    try {
      const token = await keytar.getToken();
      const config = await UndocFile.config();

      const operation = {
        query: gql`
          mutation updateAndFindAll($modified: [String!], $deletes: [String!]) {
            updateAndFindAll(modified: $modified, deletes: $deletes) {
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
        variables: { modified: this.modified, deletes: this.deletes },
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
