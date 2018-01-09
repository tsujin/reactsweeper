import React, { Component } from 'react';
import { Game } from './Game.js'

export default class App extends Component {
  constructor() {
    super();
    this.newGame = this.newGame.bind(this);
    this.state = {
      game: () => <Game bombs={10} sides={9} />
    }
  }

  newGame(bombs, sides) {
    this.setState({
      game: () => <Game bombs={bombs} sides={sides} />
    })
  }

  render() {
    const CurrentGame = this.state.game;
    return(
      <div>
        <CurrentGame />
        <div className="button-row">
          <button className="beginner" onClick={() => this.newGame(10, 9)}>Beginner</button>
          <button className="intermediate" onClick={() => this.newGame(40, 16)}>Intermediate</button>
          <button className="expert" onClick={() => this.newGame(200, 30)}>Expert</button>
        </div>
      </div>
    )
  }
}
