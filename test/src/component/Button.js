import React from 'react';
import PropTypes from 'prop-types';

export default class Button extends React.Component {
  static propTypes = {
    name: PropTypes.string,
    clickHandler: PropTypes.func,
  };

  handleClick = () => {
    this.props.clickHandler(this.props.name);
  };

  render() {
    return (
      <div className="component-button">
        <button name={this.props.name} onClick={this.handleClick}>
          {this.props.name}
        </button>
      </div>
    );
  }
}
