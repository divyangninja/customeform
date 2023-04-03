import "@/styles/globals.css";
import { ApolloProvider } from "@apollo/client";
import apolloClient from "../config/config";

export default function App({ Component, pageProps }) {
  return (
    <ApolloProvider client={apolloClient}>
      <Component {...pageProps} />
    </ApolloProvider>
  );
}
