import React, { Component } from 'react';

class Link extends Component {

  render() {
    // console.log(this.props.link)
    let { description, url } = this.props.link
    return (
      <div>{ description } ({ url })</div>
    );
  }

}

export default Link;
