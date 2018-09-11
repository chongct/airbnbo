import React, { Component } from 'react';
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag'
import Home from './Home'

const HOME_SEARCH_QUERY = gql`
  query HomeSearchQuery($filter: String!) {
    homes(filter: $filter) {
      id
      title
      price
      nbed
    }
  }
`

class Search extends Component {
  constructor() {
    super()
    this.state = {
      homes: [],
      filter: ''
    }
  }

  render() {
    return (
      <div>
        <div>
          Search
          <input type="text" onChange={(e) => this.setState({filter: e.target.value})} />
          <button onClick={() => this._executeSearch()}>
            OK
          </button>
        </div>
        {this.state.homes.map((home, index) => <Home key={home.id} home={home} index={index} />)}
      </div>
    );
  }

  _executeSearch = async () => {
    const { filter } = this.state
    const result = await this.props.client.query({
      query: HOME_SEARCH_QUERY,
      variables: { filter }
    })
    // console.log(result)
    const homes = result.data.homes
    this.setState({ homes })
  }
}

export default withApollo(Search);
