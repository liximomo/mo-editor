import PropTypes from 'prop-types';
import React from 'react';
import './ActionButton.scss';

const ActionButton = props => {
  const { icon, active, onClick } = props;
  const clz = `MoEditorActionBtn${active ? ' is-active' : ''}`;

  return (
    <button className={clz} onClick={onClick}>
      {icon}
    </button>
  );
};

ActionButton.prototype = {
  active: PropTypes.bool,
  icon: PropTypes.node.isRequired,
  onClick: PropTypes.func.isRequired,
};

ActionButton.defaultProps = {
  active: false,
};

export default ActionButton;
