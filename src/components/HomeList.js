import React, { Component, Fragment } from 'react';

import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';

import Home from './Home';

import { HOMES_PER_PAGE } from '../constants';

class HomeList extends Component {
  deleteHome = async(id) => {
    // console.log(id)
    await this.props.deleteHomesMutation({
      variables: {
        id
      }
    })
  }

  _subscribeToNewHomes = subscribeToMore => {
    subscribeToMore({
      document: NEW_HOMES_SUBSCRIPTION,
      updateQuery: (prev, { subscriptionData }) => {
        console.log(prev)
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

  _updateCacheAfterVote = (store, createVoteHome, homeId) => {
    // console.log(this.props)
    const page = parseInt(this.props.match.params.page, 10)
    const isNewPage = this.props.location.pathname.includes('new')

    const skip = isNewPage ? (page - 1) * HOMES_PER_PAGE : 0
    const first = isNewPage ? HOMES_PER_PAGE : 100
    const orderBy = isNewPage ? 'createdAt_DESC' : null

    const data = store.readQuery({
      query: HOME_LIST,
      variables: {first, skip, orderBy}
    })
    // console.log(createVoteHome)
    const votedHome = data.homeslist.homes.find(home => home.id === homeId)
    votedHome.votes = createVoteHome.home.votes
    store.writeQuery({query: HOME_LIST, data})
  }

  _subscribeToNewVotes = subscribeToMore => {
    subscribeToMore({
      document: NEW_VOTES_SUBSCRIPTION
    })
  }

  _getHomesToRender = data => {
    const isNewPage = this.props.location.pathname.includes('new')
    if (isNewPage) {
      return data
    }
    const rankedHomes = data.slice()
    rankedHomes.sort((home1, home2) => home2.votes.length - home1.votes.length)
    return rankedHomes
  }

  _nextPage = data => {
    const page = parseInt(this.props.match.params.page, 10)
    console.log(data.homes)
    if (page <= data.count / HOMES_PER_PAGE) {
      const nextPage = page + 1
      this.props.history.push(`/new/${nextPage}`)
    }
  }

  _previousPage = () => {
    const page = parseInt(this.props.match.params.page, 10)
    if (page > 1) {
      const previousPage = page - 1
      this.props.history.push(`/new/${previousPage}`)
    }
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
    this._subscribeToNewVotes(homeQuery.subscribeToMore)

    const homesToRender = this._getHomesToRender(homeQuery.homeslist.homes)
    const isNewPage = this.props.location.pathname.includes('new')
    const pageIndex = this.props.match.params.page ? (this.props.match.params.page - 1) * HOMES_PER_PAGE : 0
    let homes = homesToRender.map((home, index) => <Home key={home.id} index={index + pageIndex} home={home} onDelete={this.deleteHome} updateStoreAfterVote={this._updateCacheAfterVote}/>)

    return (
      <Fragment>
        <div>{homes}</div>

        {isNewPage && (
          <div className="flex ml4 mv3 gray">
            <div className="pointer mr2" onClick={this._previousPage}>
              Previous
            </div>
            <div className="pointer" onClick={() => this._nextPage(homeQuery.homeslist)}>
              Next
            </div>
          </div>
        )}
      </Fragment>
    );
  }

}
//
// export const HOME_LIST = gql`
//   query HomeQuery {
//     homes {
//       id
//       title
//       price
//       nbed
//       postedBy {
//         id
//         name
//       }
//       votes {
//         id
//         user {
//           id
//         }
//       }
//     }
//   }
// `
//

export const HOME_LIST = gql`
  query HomeQuery($first: Int, $skip: Int, $orderBy: HomeOrderByInput) {
    homeslist(first: $first, skip: $skip, orderBy: $orderBy) {
      homes {
        id
        title
        price
        nbed
        createdAt
        postedBy {
          id
          name
        }
        votes {
          id
          user {
            id
          }
        }
      }
      count
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

const NEW_VOTES_SUBSCRIPTION = gql`
  subscription {
    newVoteHome {
      node {
        id
        home {
          id
          title
        }
        user {
          id
          name
        }
      }
    }
  }
`

export default compose(
  graphql(HOME_LIST, {
    name: 'homeQuery',
    options: (ownProps) => {
      // console.log(ownProps)
      const page = parseInt(ownProps.match.params.page, 10)
      const isNewPage = ownProps.location.pathname.includes('new')

      const skip = isNewPage ? (page - 1) * HOMES_PER_PAGE : 0
      const first = isNewPage ? HOMES_PER_PAGE : 100
      const orderBy = isNewPage ? 'createdAt_DESC' : null
      return {
        variables: {first, skip, orderBy}
      }
    }
  }),
  graphql(DELETE_HOMES, {name: 'deleteHomesMutation'})
) (HomeList);
