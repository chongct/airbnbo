import React, { Component } from 'react';

class Home extends Component {

  render() {
    // console.log(this.props)
    let {title, price, nbed} = this.props.home
    return (
      <div className="flex mt2 items-start">
        <div className="ml1">
          {title} has {nbed} beds costs ${price}
        </div>
      </div>
    );
  }
}

export default Home;
