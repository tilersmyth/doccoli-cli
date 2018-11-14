import { execute, makePromise, GraphQLRequest } from "apollo-link";
import { HttpLink } from "apollo-link-http";
import * as fetch from "isomorphic-fetch";

export class Apollo {
  operation: GraphQLRequest;

  constructor(operation: GraphQLRequest) {
    this.operation = operation;
  }

  async fetch(): Promise<any> {
    try {
      const uri = "http://localhost:4000/";
      const Link = new HttpLink({ uri, fetch });
      const { data } = await makePromise(execute(Link, this.operation));

      return data;
    } catch (err) {
      throw err;
    }
  }
}
