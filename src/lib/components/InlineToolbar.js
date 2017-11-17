import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { EditorState } from 'draft-js';
import { INLINE } from '../TypeOfContent';
import { getSelectedBlock } from '../operation/Selection';
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
  }

  state = {
    extendView: null,
  }

  getSelectionRect = () => {
    if (this.state.extendView !== null) {
      return cacheSelectReact;
    }

    const { editorState } = this.props;
    const selection = editorState.getSelection();

    if (selection.isCollapsed()) {
      return;
    }

    const nativeSelection = getNativeSelection(window);
    const selectionRect = getNativeSelectionRect(nativeSelection);
    preSelectionRect = selectionRect;
    return selectionRect;
  }

  getBlockMeta = () => {
    const { editorState } = this.props;
    const block = getSelectedBlock(editorState);
    const meta = block.getData().get('meta');
    return meta || {};
  }

  showExtend = view => {
    const { setEditorState, editorState } = this.props;

    if (view !== null) {
      preservedSelection = editorState.getSelection();
    }

    cacheSelectReact = preSelectionRect;
    this.setState(
      {
        extendView: view,
      },
      () => {
        if (!view) {
          setEditorState(EditorState.acceptSelection(editorState, preservedSelection));
        }
      }
    );
  }

  // 是否显示
  shouldActive() {
    const { editorState } = this.props;
    const selection = editorState.getSelection();
    const hasValidSelection = !selection.isCollapsed();

    return hasValidSelection || this.state.extendView !== null;
  }

  render() {
    const { buttons, editorNode } = this.props;
    const { inline } = this.getBlockMeta();
    let avaliableButtons = buttons;
    if (inline) {
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
