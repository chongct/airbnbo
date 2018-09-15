import React, { Component } from 'react';

import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';

import Home from './Home';

class HomeList extends Component {
  deleteHome = async(id) => {
    // console.log(id)
    await this.props.deleteHomesQuery({
      variables: {
        id
      }
    })
  }

  _subscribeToNewHomes = subscribeToMore => {
    subscribeToMore({
      document: NEW_HOMES_SUBSCRIPTION,
      updateQuery: (prev, { subscriptionData }) => {
        // console.log(prev)
        if (!subscriptionData.data) return prev
        const newHome = subscriptionData.data.newHome.node

        // works only for adding of new homes but not deleting
        return Object.assign({}, prev, {
          homes: [newHome, ...prev.homes],
          count: prev.homes.length + 1,
          __typename: prev.homes.__typename
        })
      }
    })
  }

  render() {
    // console.log(this.props)
    const {homeQuery} = this.props
    console.log(homeQuery)

    if (homeQuery && homeQuery.loading) {
      return <div>Loading homes</div>
    }

    if (homeQuery && homeQuery.error) {
      return <div>{homeQuery.error.message}</div>
    }

    // component subscribes to events
    this._subscribeToNewHomes(homeQuery.subscribeToMore)

    const homesToRender = homeQuery.homes
    let homes = homesToRender.map(home => <Home key={home.id} home={home} onDelete={this.deleteHome} />)

    return (
      <div>{homes}</div>
    );
  }

}

export const HOME_LIST = gql`
  query HomeQuery {
    homes {
      id
      title
      price
      nbed
    }
  }
`

const DELETE_HOMES = gql`
  mutation DeleteHomeMutation($id: ID!) {
    deleteHome(id: $id) {
      id
    }
  }
`

// to edit server/src/resolvers/Subscription.js
// to also edit server/src/schema.graphql
// then restart server
const NEW_HOMES_SUBSCRIPTION = gql`
  subscription {
    newHome {
      node {
        id
        title
        price
        nbed
      }
    }
  }
`

export default compose(
  graphql(HOME_LIST, {name: 'homeQuery'}),
  graphql(DELETE_HOMES, {name: 'deleteHomesQuery'})
) (HomeList);
