import { ApolloClient, InMemoryCache } from "@apollo/client";
import fetch from "isomorphic-fetch";
import { createUploadLink } from "apollo-upload-client";
const cache = new InMemoryCache({ addTypename: false });
const link = createUploadLink({
  fetch,
  uri: "https://0136-2405-201-200c-823f-d0ad-232a-f862-1ab3.in.ngrok.io/graphql",
  headers: {},
});

const client = new ApolloClient({
  link,
  cache,
});

export default client;
