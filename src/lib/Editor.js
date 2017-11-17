import PropTypes from 'prop-types';

import React, { Component } from 'react';
import { Editor as DraftEditor, RichUtils } from 'draft-js';
import isSoftNewlineEvent from 'draft-js/lib/isSoftNewlineEvent';
import { HANDLED, NOT_HANDLED } from './DraftConstants';

import { getSelectedBlock } from './operation/Selection';

import createEditorState from './createEditorState';
import decorators from './decorators';
import blockRenderMap from './blocks/blockRenderMap';
import BlockHub from './blocks/BlockHub';
import * as BlockType from './blocks/TypeOfBlock';
import * as InlineStyle from './inline-styles/TypeOfInlineStyles';

// import Popover from './components/Popover';
import InlineToolbar from './components/InlineToolbar';
import AddBlockButton from './components/AddBlockButton';

import ComposerLink from './composers/ComposerLink';
import createBlockComposer from './composers/createBlockComposer';
import createInlineComposer from './composers/createInlineComposer';
import InsertComposerImage from './composers/InsertComposerImage';
import InsertComposerBreak from './composers/InsertComposerBreak';

// eslint-disable-next-line import/first
import 'draft-js/dist/Draft.css';
import './style/global.scss';
import './Editor.scss';

const defaultButtons = [
  createInlineComposer(InlineStyle.BOLD),
  createInlineComposer(InlineStyle.ITALIC),
  createInlineComposer(InlineStyle.UNDERLINE),
  ComposerLink,
  {
    id: 'separator',
  },
  createBlockComposer(BlockType.H3),
  createBlockComposer(BlockType.H4),
  createBlockComposer(BlockType.BLOCKQUOTE),
];

const defaultBlockButtons = [InsertComposerImage, InsertComposerBreak];

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
    editorState: PropTypes.object.isRequired,
    setEditorState: PropTypes.func.isRequired,
    getEditor: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.blockRendererFn = BlockHub.getBlockRendererFn();
    this.state = {
      isPopoverActive: false,
      editorState: createEditorState(null, null, decorators),
    };
    this.updateComputedValue();
  }

  componentDidUpdate() {
    this.updateComputedValue();
  }

  updateComputedValue() {
    const editorState = this.getEditorState();
    this.currentBlock = getSelectedBlock(editorState);
    this.currentBlockMeta = this.currentBlock.getData().get('meta') || {};
  }

  getChildContext() {
    return {
      editorState: this.state.editorState,
      setEditorState: this.setEditorState,
      getEditor: this.getEditor,
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
    // TODO 换行清格式；inline 调到下一个快
    const editorState = this.getEditorState;
    if (this.currentBlockMeta.inline) {
      // TODO 调到下一行
    }

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

  handleKeyCommand = (command, editorState) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      this.setEditorState(newState);
      return 'handled';
    }

    return 'not-handled';
  };

  setEditorState = (editorState, cb) => {
    this.setState({ editorState }, () => {
      if (cb) cb(this);
      this.focus();
    });
  };

  onChange = editorState => {
    this.setState({ editorState });
  };

  render() {
    const editorState = this.getEditorState();

    return (
      <div className="MoEditor">
        <div className="MoEditor__editorContainer" ref={this.setEditorContainerNode}>
          <DraftEditor
            placeholder="Enter some text..."
            ref={this.setEditorInstance}
            editorState={editorState}
            onChange={this.onChange}
            handleReturn={this.handleReturn}
            handleKeyCommand={this.handleKeyCommand}
            blockRenderMap={blockRenderMap}
            blockRendererFn={this.blockRendererFn}
          />
          <AddBlockButton
            editorState={editorState} /* 正确响应编辑器状态更新 */
            setEditorState={this.setEditorState}
            positionNode={this._editorContainer}
            buttons={defaultBlockButtons}
          />
          <InlineToolbar
            editorNode={this._editorContainer}
            editorState={editorState} /* 正确响应编辑器状态更新 */
            setEditorState={this.setEditorState}
            buttons={defaultButtons}
          />
          {/* <Popover
            active={this.shouldActivePopover()}
            positionNode={this._editorContainer}
            getTargetRect={this.getSelectionRect}
          >
            <Toolbar editorState={editorState} buttons={defaultButtons} />
          </Popover> */}
        </div>
      </div>
    );
  }
}
