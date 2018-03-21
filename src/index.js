import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.css';
import App from './components/App';
import registerServiceWorker from './registerServiceWorker';

// importing required dependencies from installed npm packages
import { ApolloProvider } from 'react-apollo'
import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'

// this is the link to connect to your graphql server (HTTP only!)
const httpLink = new HttpLink({ uri: 'http://localhost:4000' })

// this is the object that helps to run the graphql query
// or mutation for you
const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache()
})

// ApolloProvider provides graphql connection to our main component
ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
  , document.getElementById('root'));
registerServiceWorker();
