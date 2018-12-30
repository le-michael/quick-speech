import React, { Component } from 'react';

import './css/App.css';
import './css/normalize.css'

import TextDisplay from './components/textDisplay.jsx';
import Keyboard from './components/keyboard.jsx';
import Menu from './components/menu.jsx';

import ClientStore from './stores/clientStore';

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {'appState': ClientStore.getState()}
    this._onChange = this._onChange.bind(this);
  }

  componentDidMount() {
    ClientStore.addChangeListener(this._onChange);
  }

  componentWillUnmount() {
      ClientStore.removeChangeListener(this._onChange);
  }

  _onChange() {
    this.setState({'appState': ClientStore.getState()})
  }
  render() {
    return (
      <div>
        
        <div className="App">
          <p className="state">Current State: {ClientStore.getState()}</p>
          <TextDisplay></TextDisplay>
          <Menu></Menu>
          <Keyboard></Keyboard>
        </div>
      </div>
    );
  }
}

export default App;
