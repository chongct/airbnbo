import React, { Component } from 'react';

import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import Home from './Home';

class HomeList extends Component {

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
    let homes = homesToRender.map(home => <Home key={home.id} home={home} />)

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

export default graphql(HOME_LIST, {name: 'homeQuery'}) (HomeList);
