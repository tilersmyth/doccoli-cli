import gql from "graphql-tag";

import { Apollo } from "./Apollo";
import keytar from "../utils/keytar";
import { UndocFile } from "../utils/UndocFile";

export class UpdateFilesApi {
  renames: any;
  deletes: any;

  constructor(renames: any, deletes: any) {
    this.renames = renames || [];
    this.deletes = deletes || [];
  }

  async results(): Promise<any> {
    try {
      const token = await keytar.getToken();
      const config = await UndocFile.config();

      const operation = {
        query: gql`
          mutation updateAndFindAll($renames: [String!], $deletes: [String!]) {
            updateAndFindAll(renames: $renames, deletes: $deletes) {
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
        variables: { renames: this.renames, deletes: this.deletes },
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
