import React, { Component } from 'react';

class Home extends Component {

  render() {
    // console.log(this.props)
    let {title, price, nbed, id} = this.props.home
    return (
      <div className="flex mt2 items-start">
        <div className="ml1">
          {title} has {nbed} beds costs ${price}
        </div>
        <a className="f6 link dim ph2 pv1 mh2 mb1 white bg-black" href="#0" onClick={() => this.props.onDelete(id)}>
          Delete
        </a>
      </div>
    );
  }
}

export default Home;
