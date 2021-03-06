import PropTypes from 'prop-types';
import React from 'react';
import './IconButton.scss';

const Button = props => {
  const { icon, active, modifier, onClick, className, ...rest } = props;
  const clz = [
    className,
    'MoIconBtn',
    active ? ' is-active' : '',
    modifier ? `MoIconBtn--${modifier}` : '',
  ].join(' ');

  return (
    <button className={clz} onClick={onClick} {...rest}>
      {icon}
    </button>
  );
};

Button.prototype = {
  active: PropTypes.bool,
  icon: PropTypes.node.isRequired,
  onClick: PropTypes.func.isRequired,
  modifier: PropTypes.string,
};

Button.defaultProps = {
  active: false,
};

export default Button;
