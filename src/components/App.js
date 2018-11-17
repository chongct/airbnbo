import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom'
// import logo from '../logo.svg';
import '../styles/App.css';
import Header from './Header'
import LinkList from './LinkList'
import CreateHomeForm from './CreateHomeForm'
import Login from './Login'
import HomeList from './HomeList'
import Search from './Search'
import Card from './Card'

class App extends Component {
  render() {
    return (
      <div className="center w85">
        <Header />
        <div className="ph3 pv1 background-gray">
          <Switch>
            <Route exact path="/login" component={Login} />
            <Route exact path="/" component={LinkList} />
            <Route exact path="/create" component={CreateHomeForm} />
            {/* <Route exact path="/home" component={HomeList} /> */}
            <Route exact path="/home" render={() => <Redirect to='/new/1' />} />
            <Route exact path="/search" component={Search} />
            <Route exact path="/top" component={HomeList} />
            <Route exact path="/new/:page" component={HomeList} />

            // Deck of cards API
            <Route exact path="/card" component={Card} />
          </Switch>
        </div>
      </div>
    )
  }
}

export default App;
