import React, { Component } from 'react';
import { AUTH_TOKEN } from '../constants';
import { timeDifferenceForDate } from '../utils';

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
            <div className="ml1 gray fl1" onClick={() => this._voteForLink()}>
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
        {/* <div className="f6 lh-copy gray">
          {this.props.home.votes.length} votes | by{' '}
          {this.props.home.postedBy ? this.props.home.postedBy.name : 'Unknown'}{' '}
          {timeDifferenceForDate(this.props.home.createdAt)}
        </div> */}
      </div>
    );
  }
}

export default Home;
