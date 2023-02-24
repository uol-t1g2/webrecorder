import Button from './Button';
import React from 'react';
import PropTypes from 'prop-types';

export default class ButtonsPanel extends React.Component {
  static propTypes = {
    clickHandler: PropTypes.func,
  };

  handleClick = (buttonName) => {
    this.props.clickHandler(buttonName);
  };

  render() {
    return (
      <div className="button-panel">
        <div>
          <Button name="Docs" clickHandler={this.handleClick} />
          <Button name="Get Started" clickHandler={this.handleClick} />
          <Button name="Learn React" clickHandler={this.handleClick} />
          <Button name="Community" clickHandler={this.handleClick} />
        </div>
        <div>
          <Button name="Stack Overflow" clickHandler={this.handleClick} />
          <Button name="GitHub Discussions" clickHandler={this.handleClick} />
          <Button name="Twitter" clickHandler={this.handleClick} />
          <Button name="Contributor Covenant" clickHandler={this.handleClick} />
        </div>
        <div>
          <Button name="Social" clickHandler={this.handleClick} />
          <Button name="Github" clickHandler={this.handleClick} />
          <Button name="Facebook" clickHandler={this.handleClick} />
          <Button name="Open Source" clickHandler={this.handleClick} />
        </div>
      </div>
    );
  }
}
