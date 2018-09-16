import React, { Component } from 'react';
import { AUTH_TOKEN } from '../constants';
import { timeDifferenceForDate } from '../utils';

import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

class Home extends Component {

  render() {
    const authToken = localStorage.getItem(AUTH_TOKEN)
    // console.log(this.props)
    let {title, price, nbed, id} = this.props.home
    return (
      <div className="flex mt2 items-start">
        <div className="flex items-center">
          <span className="gray">{this.props.index + 1}.</span>
          {authToken && (
            <div className="ml1 gray fl1 vote-home-btn" onClick={() => this._voteForHome()}>
              ▲
            </div>
          )}
        </div>
        <div className="ml1">
          {title} has {nbed} beds costs ${price}
        </div>
        <a className="f6 link dim ph2 pv1 mh2 mb1 white bg-black" href="#0" onClick={() => this.props.onDelete(id)}>
          Delete
        </a>
        <div className="f6 lh-copy gray">
          {this.props.home.votes.length} votes | by{' '}
          {this.props.home.postedBy ? this.props.home.postedBy.name : 'Unknown'}{' '}
          {timeDifferenceForDate(this.props.home.createdAt)}
        </div>
      </div>
    );
  }

  _voteForHome = async () => {
    const homeId = this.props.home.id
    await this.props.voteHomeMutation({
      variables: {
        homeId
      },
      update: (store, {data: {voteHome}}) => {
        this.props.updateStoreAfterVote(store, voteHome, homeId)
      }
    })
  }
}

const VOTE_HOME_MUTATION = gql`
  mutation VoteHomeMutation($homeId: ID!) {
    voteHome(homeId: $homeId) {
      id
      home {
        id
        title
        price
        nbed
        votes {
          id
          user {
            id
          }
        }
      }
      user {
        id
      }
    }
  }
`

export default graphql(VOTE_HOME_MUTATION, {
  name: 'voteHomeMutation'
}) (Home);
