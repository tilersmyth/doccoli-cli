import { Apollo } from "./Apollo";
import gql from "graphql-tag";

import {
  LoginMutationVariables,
  LoginMutation_cliLogin
} from "../types/schema";

export class LoginApi {
  values: LoginMutationVariables;

  constructor(values: LoginMutationVariables) {
    this.values = values;
  }

  async results(): Promise<LoginMutation_cliLogin> {
    const operation = {
      query: gql`
        mutation LoginMutation($email: String!, $password: String!) {
          cliLogin(email: $email, password: $password) {
            token
            errors {
              path
              message
            }
          }
        }
      `,
      variables: this.values
    };

    try {
      const { cliLogin } = await new Apollo(operation).fetch();
      return cliLogin;
    } catch (err) {
      throw err;
    }
  }
}
