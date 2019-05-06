import { Apollo } from "./Apollo";
import gql from "graphql-tag";

import {
  LoginMutationVariables,
  LoginMutation_cliLogin
} from "../types/schema";

export class LoginApi extends Apollo {
  values: LoginMutationVariables;

  constructor(values: LoginMutationVariables) {
    super();
    this.values = values;
  }

  async results(): Promise<LoginMutation_cliLogin> {
    const operation = {
      query: gql`
        mutation LoginMutation($email: String!, $password: String!) {
          cliLogin(email: $email, password: $password) {
            token
            error
          }
        }
      `,
      variables: this.values
    };

    try {
      const { cliLogin } = await this.fetch(operation);
      return cliLogin;
    } catch (err) {
      throw err;
    }
  }
}
