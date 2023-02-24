import React from 'react';
import Textarea from './Textarea';
import ButtonsPanel from './ButtonsPanel';
import isClick from '../logic/isClick';

export default class App extends React.Component {
  state = {
    buttonname: null,
  };

  handleClick = (buttonID) => {
    this.setState(isClick(buttonID, this.state.buttonname));
  };

  render() {
    return (
      <div className="component-app">
        <ButtonsPanel clickHandler={this.handleClick} />
        <Textarea name={'You clicked ' + this.state.buttonname} />
      </div>
    );
  }
}
