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

  render() {
    // console.log(this.props)
    const {homeQuery} = this.props
    // console.log(homeQuery)

    if (homeQuery && homeQuery.loading) {
      return <div>Loading homes</div>
    }

    if (homeQuery && homeQuery.error) {
      return <div>{homeQuery.error.message}</div>
    }

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

export default compose(
  graphql(HOME_LIST, {name: 'homeQuery'}),
  graphql(DELETE_HOMES, {name: 'deleteHomesQuery'})
) (HomeList);
