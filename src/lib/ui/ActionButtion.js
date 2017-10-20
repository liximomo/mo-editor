import PropTypes from 'prop-types';
import React from 'react';
import './ActionButtion.scss';

const ActionButton = (props) => {
  return (
    <button></button>
  );
};

ActionButton.prototype = {
  icon: PropTypes.node.isRequired,
  active: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
};

ActionButton.defaultProps = {
  active: false,
};

export default ActionButton;
