import React from 'react';
import PropTypes from 'prop-types';

export default class Textarea extends React.Component {
  static propTypes = {
    name: PropTypes.string,
  };

  render() {
    return (
      <div className="button-state-textarea">
        <div>{this.props.name}</div>
      </div>
    );
  }
}
