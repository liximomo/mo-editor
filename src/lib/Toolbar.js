import PropTypes from 'prop-types';
import React, { Component } from 'react';

import './Toolbar.scss';

const renderToolBar = props => {
  const { items, editorState, setEditorState } = props;

  return (
    <div className="MoEditorToolbar">
      {items.map((item, index) => {
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
            {item.render({ editorState, setEditorState })}
          </div>
        );
      })}
    </div>
  );
};

class Toolbar extends Component {
  static propTypes = {
    setEditorState: PropTypes.func.isRequired,
    editorState: PropTypes.object.isRequired,
    items: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        render: PropTypes.func,
        title: PropTypes.string,
      })
    ).isRequired,
  };

  render() {
    return renderToolBar(this.props);
  }
}

export default Toolbar;
