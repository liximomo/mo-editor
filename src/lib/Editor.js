import PropTypes from 'prop-types';

import React, { Component } from 'react';
import { Editor as Draft, RichUtils } from 'draft-js';
import isSoftNewlineEvent from 'draft-js/lib/isSoftNewlineEvent';
import { HANDLED, NOT_HANDLED } from './DraftConstants';

import { getCurrentBlock } from './operation/Block';

import createEditorState from './createEditorState';
import decorators from './decorators';
import blockRenderMap from './blocks/blockRenderMap';
import blockRendererFn from './blocks/blockRendererFn';
import * as BlockType from './blocks/TypeOfBlock';
import * as InlineStyle from './inline-styles/TypeOfInlineStyles';

import Popover from './components/Popover';
import Toolbar from './components/Toolbar';
import AddBlockButton from './components/AddBlockButton';

import LinkComposer from './composers/LinkComposer';
import createBlockComposer from './composers/createBlockComposer';
import createInlineComposer from './composers/createInlineComposer';
import ImageComposer from './composers/ImageComposer';
import BreakComposer from './composers/BreakComposer';

import {
  getSelectionRect as getNativeSelectionRect,
  getSelection as getNativeSelection,
} from './utils/selection';

// eslint-disable-next-line import/first
import 'draft-js/dist/Draft.css';
import './style/global.scss';
import './Editor.scss';

const defaultButtons = [
  createBlockComposer(BlockType.H3),
  createBlockComposer(BlockType.H4),
  createBlockComposer(BlockType.BLOCKQUOTE),
  {
    id: 'separator',
  },
  createInlineComposer(InlineStyle.BOLD),
  createInlineComposer(InlineStyle.ITALIC),
  createInlineComposer(InlineStyle.UNDERLINE),
  LinkComposer,
];

const defaultBlockButtons = [ImageComposer, BreakComposer];

export default class Editor extends Component {
  static propTypes = {
    buttons: PropTypes.arrayOf(PropTypes.string),
  };

  static defaultProps = {
    active: false,
    direction: 'top',
    offset: 5,
  };

  static childContextTypes = {
    editor: PropTypes.shape({
      editorState: PropTypes.object.isRequired,
      setEditorState: PropTypes.func.isRequired,
    }),
  };

  constructor(props) {
    super(props);

    this.state = {
      isPopoverActive: false,
      editorState: createEditorState(null, null, decorators),
    };
  }

  getChildContext() {
    return {
      editor: {
        editorState: this.state.editorState,
        setEditorState: this.handleChange,
      },
    };
  }

  componentDidMount() {
    this.focus();
  }

  setEditorInstance = instance => {
    this._editor = instance;
  };

  setEditorContainerNode = node => {
    this._editorContainer = node;
  };

  getEditor = () => {
    return this._editor;
  };

  getEditorState = () => {
    return this.state.editorState;
  };

  focus = () => {
    return this.getEditor().focus();
  };

  /**
   * 
   * 处理回车，主要是覆盖定制的 renderer 中回车行为
   * @param {Event} event 
   * @returns 
   * @memberof Editor
   */
  handleReturn(event) {
    console.log('enter handle');
    const editorState = this.getEditorState;
    if (isSoftNewlineEvent(event)) {
      this.onChange(RichUtils.insertSoftNewline(editorState));
      return HANDLED;
    }

    if (event.altKey || event.metaKey || event.ctrlKey) {
      return NOT_HANDLED;
    }

    // const currentBlock = getCurrentBlock(editorState);
    // const blockType = currentBlock.getType();

    // if (currentBlock.getLength() === 0) {
    //   switch (blockType) {
    //     case Block.UL:
    //     case Block.OL:
    //     case Block.BLOCKQUOTE:
    //     case Block.BLOCKQUOTE_CAPTION:
    //     case Block.CAPTION:
    //     case Block.TODO:
    //     case Block.H2:
    //     case Block.H3:
    //     case Block.H1:
    //       this.onChange(resetBlockWithType(editorState, Block.UNSTYLED));
    //       return HANDLED;
    //     default:
    //       return NOT_HANDLED;
    //   }
    // }

    // const selection = editorState.getSelection();

    // if (selection.isCollapsed() && currentBlock.getLength() === selection.getStartOffset()) {
    //   if (this.props.continuousBlocks.indexOf(blockType) < 0) {
    //     this.onChange(addNewBlockAt(editorState, currentBlock.getKey()));
    //     return HANDLED;
    //   }
    //   return NOT_HANDLED;
    // }
    // return NOT_HANDLED;
  }

  handleChange = (editorState, cb) => {
    this.setState({ editorState }, () => {
      if (cb) {
        cb(this);
      }
      this.focus();
    });
  };

  shouldActivePopover() {
    const editorState = this.getEditorState();
    const selection = editorState.getSelection();
    let hasValidSelection = false;

    hasValidSelection = !selection.isCollapsed();

    return this.state.isPopoverActive || hasValidSelection;
  }

  getSelectionRect = () => {
    const editorState = this.getEditorState();
    const selection = editorState.getSelection();

    if (selection.isCollapsed()) {
      return;
    }

    const nativeSelection = getNativeSelection(window);
    const selectionRect = getNativeSelectionRect(nativeSelection);
    return selectionRect;
  };

  shouldActiveAddBlockButton() {
    const editorState = this.getEditorState();
    const selection = editorState.getSelection();
    const contentState = editorState.getCurrentContent();
    if (
      !selection.isCollapsed() ||
      selection.anchorKey !== selection.focusKey || // 有范围选择
      contentState
        .getBlockForKey(selection.getAnchorKey())
        .getType()
        .indexOf(BlockType.ATOMIC) >= 0 // 在原子块内
    ) {
      return false;
    }

    const block = contentState.getBlockForKey(selection.anchorKey);

    if (block.getLength() > 0) {
      return false;
    }

    return true;
  }

  render() {
    const editorState = this.getEditorState();

    return (
      <div className="MoEditor">
        <div className="MoEditor__editorContainer" ref={this.setEditorContainerNode}>
          <Draft
            ref={this.setEditorInstance}
            editorState={this.state.editorState}
            onChange={this.handleChange}
            blockRenderMap={blockRenderMap}
            blockRendererFn={blockRendererFn}
            handleReturn={this.handleReturn}
          />
          <AddBlockButton
            active={this.shouldActiveAddBlockButton()}
            editorState={editorState} /* 正确响应编辑器状态更新 */
            positionNode={this._editorContainer}
            buttons={defaultBlockButtons}
          />
          <Popover
            active={this.shouldActivePopover()}
            positionNode={this._editorContainer}
            getTargetRect={this.getSelectionRect}
          >
            <Toolbar editorState={editorState} buttons={defaultButtons} />
          </Popover>
        </div>
      </div>
    );
  }
}
