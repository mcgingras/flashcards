import React, { Component } from 'react';
import './App.css';

import Footer from './components/footer';
import Cards from './components/cards';

class App extends Component {
  constructor(props){
    super(props);

    this.state = {
      users: [],
      rank: [],
      d: 10,
      k: 10
    }
  }

  componentDidMount(){
    // get all users from database so we can display them on UI.
    // in the future, with many leagues, we will have to specify leagues as well
    // to filter the users that we are displaying.
    fetch('http://localhost:3000/users')
    .then((res) => res.json())
    .then((users) => this.setState({users}))
  }

  addRank(name){
    console.log(this.state.rank);
    this.setState(prevState => ({
      rank: [...prevState.rank, name]
    }))
  }

  calculateElo(){
    const denom = this.state.rank.length*(this.state.rank.length-1)/2;
    // need to save scores so they do not alter the later calculations
    const tempScores = [];
    var expected, score;
    for (var i = 0; i < this.state.rank.length; i++) {
      var expCount = 0;
      for (var j = 0; j < this.state.rank.length; j++) {
        if(i !== j){
          expCount += 1 / (1+10**((this.state.rank[i][1] - this.state.rank[j][1])/this.state.d));
        }
      }
      expected = expCount/denom;
      score = (this.state.rank.length - i - 1)/denom;
      tempScores[i] = this.state.rank[i][1] + this.state.k*(score - expected);
    }

    // rehydrate player class scores with updated scores
    for (var k = 0; k < this.state.rank.length; k++) {
      fetch(`http://localhost:3000/user/${this.state.rank[k][0]}`, {
        body: JSON.stringify({"rating": tempScores[k]}),
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST'
      })
      .then((res) => res.json())
      .then((user) => console.log(user));
    }

    // there might be a problem where state gets cleared out before all the fetches are done...
    // not really sure though.
    this.setState({
      rank: []
    })
  }


  render() {
    return (
      <div className="App">
      <Cards />
      </div>
    );
  }
}

export default App;
