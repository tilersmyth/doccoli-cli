import gql from "graphql-tag";

import { Apollo } from "./Apollo";

import { CliLastCommit_cliLastCommit } from "../types/schema";
import keytar from "../utils/keytar";
import { UndocFile } from "../utils/UndocFile";

export class LastCommitApi extends Apollo {
  branch: string;

  constructor(branch: string) {
    super();
    this.branch = branch;
  }

  async results(): Promise<any> {
    try {
      const token = await keytar.getToken();
      const config = await UndocFile.config();

      const operation = {
        query: gql`
          query CliLastCommit($branch: String!) {
            cliLastCommit(branch: $branch) {
              project {
                name
              }
              user {
                firstName
                lastName
              }
              commit {
                sha
                branch
                createdAt
              }
              branches
              error {
                path
                message
              }
            }
          }
        `,
        variables: { branch: this.branch },
        context: {
          headers: {
            Authorization: token,
            ProjectKey: config.key
          }
        }
      };

      const {
        cliLastCommit: { error, ...args }
      } = await this.fetch(operation);

      if (error) {
        throw error.message;
      }

      return { ...args };
    } catch (err) {
      throw err;
    }
  }
}
