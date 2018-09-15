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

import { BrowserRouter } from 'react-router-dom'

import { AUTH_TOKEN } from './constants'
import { ApolloLink } from 'apollo-client-preset'

// these packages are for ws connection (web socket) / subscriptions
import { split } from 'apollo-link'
import { WebSocketLink } from 'apollo-link-ws'
import { getMainDefinition } from 'apollo-utilities'

// this is the link to connect to your graphql server (HTTP only!)
const httpLink = new HttpLink({ uri: 'http://localhost:4000' })


// create one more link for ws (websocket)
const wsLink = new WebSocketLink({
  uri: 'ws://localhost:4000',
  options: {
    reconnect: true, // for websocket, if false, it will drop connection when connection is down
    connectionParams: {
      authToken: localStorage.getItem(AUTH_TOKEN)
    }
  }
})


// authentication
const middlewareAuthLink = new ApolloLink((operation, forward) => {
  const token = localStorage.getItem(AUTH_TOKEN)
  const authorizationHeader = token ? `Bearer ${token}` : null
  operation.setContext({
    headers: {
      authorization: authorizationHeader
    }
  })
  return forward(operation)
})

const httpLinkWithAuthToken = middlewareAuthLink.concat(httpLink)

const splitFn = ({ query }) => {
  const { kind, operation } = getMainDefinition(query)
  return kind === 'OperationDefinition' && operation === 'subscription' // returns boolean
}

// split the method according to the request (type of operation) and route a request to a specific middleware link
const link = split( // split takes three arguments
  splitFn, // how are you going to split
  wsLink, // if splitFn true, use wsLink (type of ApolloLink) - for subscription
  httpLinkWithAuthToken // if splitFn false, use httpLink (type of ApolloLink) - for query or mutation
)


// this is the object that helps to run the graphql query
// or mutation for you
const client = new ApolloClient({
  link,
  // link: httpLinkWithAuthToken,
  cache: new InMemoryCache()
})


// ApolloProvider provides graphql connection to our main component
ReactDOM.render(
  <BrowserRouter>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </BrowserRouter>
  , document.getElementById('root'));
registerServiceWorker();
