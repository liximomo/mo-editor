import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { INLINE } from '../TypeOfContent';
// import cn from 'classnames';

import {
  getSelectionRect as getNativeSelectionRect,
  getSelection as getNativeSelection,
} from '../utils/selection';
import Popover from './Popover';

import './InlineToolbar.scss';

// 由于 InlineToolbar 是单例，所以全局状态是安全的
let cacheSelectReact;
let preSelectionRect;
let preservedSelection;

// 单例
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

  state = {
    extendView: null,
  };

  getSelectionRect = () => {
    if (this.state.extendView !== null) {
      return cacheSelectReact;
    }

    const { selection } = this.props;
    // const selection = editorState.getSelection();

    if (selection.isCollapsed()) {
      return;
    }

    const nativeSelection = getNativeSelection(window);
    const selectionRect = getNativeSelectionRect(nativeSelection);
    preSelectionRect = selectionRect;
    return selectionRect;
  };

  /**
   * view 不为空 show view,
   * view 为空 恢复之前状态
   */
  showExtend = view => {
    const { /* setEditorState, */ selection } = this.props;

    const showView = view !== null;
    if (showView) {
      preservedSelection = selection;
    }

    cacheSelectReact = preSelectionRect;
    this.setState(
      {
        extendView: view,
      },
      () => {
        if (showView) {
          // 忘记了为什么需要这个，先取消，因为会影响 input 的 aufoFocus
          // setEditorState(editorState => EditorState.acceptSelection(editorState, preservedSelection));
        }
      }
    );
  };

  // 是否显示
  shouldActive() {
    const { selection, selectedTextLength } = this.props;
    let hasValidSelection = !selection.isCollapsed();

    if (hasValidSelection) {
      hasValidSelection = hasValidSelection && selectedTextLength > 0;
    }

    return hasValidSelection || this.state.extendView !== null;
  }

  render() {
    const { buttons, editorNode, onlyInline } = this.props;
    let avaliableButtons = buttons;
    if (onlyInline) {
      avaliableButtons = avaliableButtons.filter(btn => btn.type === INLINE);
    }

    return (
      <Popover
        active={this.shouldActive()}
        positionNode={editorNode}
        getTargetRect={this.getSelectionRect}
      >
        <div className="MoInlineToolbar">
          {this.state.extendView
            ? this.state.extendView
            : avaliableButtons.map((item, index) => {
                if (item.id === 'separator') {
                  return (
                    <div
                      key={`separator${index}`}
                      className="MoInlineToolbar__btn MoInlineToolbar__btn--separator"
                    />
                  );
                }

                return (
                  <div className="MoInlineToolbar__btn" key={item.id} title={item.title}>
                    {item.render({
                      showExtend: this.showExtend,
                    })}
                  </div>
                );
              })}
        </div>
      </Popover>
    );
  }
}

export default InlineToolbar;
