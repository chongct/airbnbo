import React, { Component } from 'react';
import { graphql } from 'react-apollo'; // to help us run the queries
import gql from 'graphql-tag'; // write graphql queries

import { HOME_LIST } from './HomeList';

import { HOMES_PER_PAGE } from '../constants';

class CreateHomeForm extends Component {
  constructor() {
    super()
    this.state = { // not setState, this is initializing state, an object
      homeTitle: '',
      homePrice: 0,
      homeBeds: 0
    }
  }

  // controlled form
  handleTitleChange = (e) => {
    this.setState({
      homeTitle: e.target.value
    })
  }

  handlePriceChange = (e) => {
    this.setState({
      homePrice: e.target.value
    })
  }

  handleBedChange = (e) => {
    this.setState({
      homeBeds: e.target.value
    })
  }

  controlSubmitForm = async (e) => {
    e.preventDefault()

    // console.log({...this.state})
    console.log(this.props)

    let {homeTitle: title, homePrice: price, homeBeds: nbed} = this.state

    try {
      await this.props.postMutation({
        variables: {
          title,
          price,
          nbed
        },
        update: (store, {data: {createHome}}) => {
          const first = HOMES_PER_PAGE
          const skip = 0
          const orderBy = 'createdAt_DESC'

          // IMPORTANT - in order not to see error messages
          // to load store / cached data, need to load homes first or query HOME_LIST first
          // 'readQuery' always reads data from the local cache while 'query' might retrieve data either from the cache or remotely
          const data = store.readQuery({
            query: HOME_LIST,
            variables: {first, skip, orderBy}
          })
          data.homeslist.homes.splice(0, 0, createHome)
          store.writeQuery({
            query: HOME_LIST,
            data,
            variables: {first, skip, orderBy}
          })
        }
      })
    } catch (e) {
      console.log(e)
    }
    // redirect from CreateHomeForm to HomeList after a mutation was performed
    this.props.history.push('/new/1')
  }

  // uncontrolled form
  submitForm = () => {
    alert('form is being submitted')
    alert(this._homeTitle.value)
  }

  render() {
    return (
      <div>
        <p>
          State now:<br />
          Title: {this.state.homeTitle}<br />
          Price: {this.state.homePrice}<br />
          Beds: {this.state.homeBeds}<br />
        </p>

        <h1>Controlled Form to create home here</h1>
        <form className="flex flex-column ma3" onSubmit={this.controlSubmitForm}>
          <label>Home Title:</label>
          <input className="mb2" value={this.state.homeTitle} onChange={this.handleTitleChange} type="text" placeholder="Home Title" />

          <label>Home Price:</label>
          <input className="mb2" value={this.state.homePrice} onChange={this.handlePriceChange} type="tel" />

          <label>Home Beds:</label>
          <input className="mb2" value={this.state.homeBeds} onChange={this.handleBedChange} type="tel" />

          <button>Control Create</button>
        </form>

        <h1>Uncontrolled form</h1>
        <div className="flex flex-column ma3">
          <input type="text" ref={input => this._homeTitle = input} />
          <button onClick={this.submitForm}>Uncontrolled Create</button>
        </div>
      </div>
    );
  }
}

const CREATE_HOME = gql`
  mutation PostMutation ($title: String!, $price: Int!, $nbed: Int!) { # mutation name, takes three arguments
    createHome(title: $title, price: $price, nbed: $nbed) { # resolver name, add resolver function in server/src/resolvers/mutation and server/src/schema.graphql
      title
      price
      nbed
      createdAt
      postedBy {
        id
        name
      }
    }
  }
`

export default graphql(CREATE_HOME, {name: 'postMutation'})(CreateHomeForm)
// export default CreateHomeForm;
