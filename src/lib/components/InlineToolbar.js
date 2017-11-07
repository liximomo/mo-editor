import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  getSelectionRect as getNativeSelectionRect,
  getSelection as getNativeSelection,
} from '../utils/selection';
import Popover from './Popover';

import './InlineToolbar.scss';

class InlineToolbar extends Component {
  static propTypes = {
    buttons: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        element: PropTypes.node,
        title: PropTypes.string,
      })
    ).isRequired,
  };

  getSelectionRect = () => {
    const { editorState } = this.props;
    const selection = editorState.getSelection();

    if (selection.isCollapsed()) {
      return;
    }

    const nativeSelection = getNativeSelection(window);
    const selectionRect = getNativeSelectionRect(nativeSelection);
    return selectionRect;
  };

  // 是否显示
  shouldActive() {
    const { editorState } = this.props;
    const selection = editorState.getSelection();
    const hasValidSelection = !selection.isCollapsed();

    return hasValidSelection;
  }

  render() {
    const { buttons, editorNode } = this.props;
    return (
      <Popover
        active={this.shouldActive()}
        positionNode={editorNode}
        getTargetRect={this.getSelectionRect}
      >
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
      </Popover>
    );
  }
}

export default InlineToolbar;
