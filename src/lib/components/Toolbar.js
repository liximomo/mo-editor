import PropTypes from 'prop-types';
import React, { Component } from 'react';

import './Toolbar.scss';

const renderToolBar = props => {
  const { buttons } = props;

  return (
    <div className="MoEditorToolbar">
      {buttons.map((item, index) => {
        if (item.id === 'separator') {
          return (
            <div
              key={`separator${index}`}
              className="MoEditorToolbar__btn MoEditorToolbar__btn--separator"
            />
          );
        }

        return (
          <div className="MoEditorToolbar__btn" key={item.id} title={item.title}>
            {item.element}
          </div>
        );
      })}
    </div>
  );
};

class Toolbar extends Component {
  static propTypes = {
    buttons: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        element: PropTypes.node,
        title: PropTypes.string,
      })
    ).isRequired,
  };

  render() {
    return renderToolBar(this.props);
  }
}

export default Toolbar;
