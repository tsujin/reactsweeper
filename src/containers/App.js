import React, { Component } from 'react';
import { Game } from './Game.js'

export default class App extends Component {
  constructor() {
    super();
    this.newGame = this.newGame.bind(this);
    this.state = {
      game: () => <Game />
    }
  }

  newGame() {
    this.setState({
      game: () => <Game />
    })
  }

  componentDidMount() {
    console.log("mounted successfully")
  }

  render() {
    const CurrentGame = this.state.game;
    return(
      <div>
        <CurrentGame />
        <button onClick={this.newGame}>Reset Game</button>
      </div>
    )
  }
}
