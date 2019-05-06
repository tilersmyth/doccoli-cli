import gql from "graphql-tag";

import { Apollo } from "./Apollo";

import { MeQuery_cliMe } from "../types/schema";
import keytar from "../utils/keytar";

export class MeApi extends Apollo {
  async results(): Promise<MeQuery_cliMe> {
    try {
      const token = await keytar.getToken();
      const operation = {
        query: gql`
          query MeQuery {
            cliMe {
              user {
                id
                email
                firstName
                lastName
              }
              error {
                path
                message
              }
            }
          }
        `,
        context: {
          headers: {
            Authorization: token
          }
        }
      };

      const {
        cliMe: { user, error }
      } = await this.fetch(operation);

      if (error) {
        throw error.message;
      }

      return user;
    } catch (err) {
      throw err;
    }
  }
}
