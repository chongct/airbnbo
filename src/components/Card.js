import React, { Component } from 'react';

class Card extends Component {
  constructor() {
    super()
    this.state = {
      deck_id: "",
      showCards: [],
      remaining: null
    }
  }

  componentDidMount = async () => {
    const DECK_API = 'https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1'
    let response = await fetch(DECK_API)
    let { deck_id, remaining } = await response.json()
    this.setState({
      deck_id,
      remaining
    })
    this.drawCards(this.state.deck_id)
  }

  drawCards = async (id) => {
    let drawResponse = await fetch(`https://deckofcardsapi.com/api/deck/${id}/draw/?count=10`)
    let { cards, remaining } = await drawResponse.json()
    this.setState({
      showCards: cards,
      remaining
    })
    console.log(this.state)
  }

  render() {
    let displayCards = this.state.showCards.map(card => <img src={card.image} key={card.code}/>)

    return (
      <div>
        <h4>Card List</h4>
        <a className="f6 link dim br1 ph3 pv2 mb2 dib white bg-black add-card-btn" onClick={() => this.drawCards(this.state.deck_id)}>Add cards</a>
        <div className="flex justify-center">
          <div className="fl w-80 pa2">
            { displayCards }
          </div>
        </div>
      </div>
    );
  }

}

export default Card;
