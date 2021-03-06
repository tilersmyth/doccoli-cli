import { execute, makePromise, GraphQLRequest } from "apollo-link";
import { HttpLink } from "apollo-link-http";
import * as fetch from "isomorphic-fetch";

export class Apollo {
  async fetch(operation: GraphQLRequest): Promise<any> {
    try {
      const uri = "http://localhost:4000/";
      const Link = new HttpLink({ uri, fetch });
      const { data } = await makePromise(execute(Link, operation));

      return data;
    } catch (err) {
      throw err;
    }
  }
}
