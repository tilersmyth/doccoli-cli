import gql from "graphql-tag";

import { Apollo } from "./Apollo";

import { MeQuery_cliMe } from "../types/schema";

export class MeApi {
  token: string;

  constructor(token: string) {
    this.token = token;
  }

  async results(): Promise<MeQuery_cliMe> {
    const operation = {
      query: gql`
        query MeQuery {
          cliMe {
            ok
            me {
              id
              email
              firstName
              lastName
            }
          }
        }
      `,
      context: {
        headers: {
          Authorization: this.token
        }
      }
    };
    try {
      const { cliMe } = await new Apollo(operation).fetch();
      return cliMe;
    } catch (err) {
      throw err;
    }
  }
}
