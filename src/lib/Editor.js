import PropTypes from 'prop-types';

import React, { Component } from 'react';
import { Editor as DraftEditor, RichUtils } from 'draft-js';
import isSoftNewlineEvent from 'draft-js/lib/isSoftNewlineEvent';
import { HANDLED, NOT_HANDLED } from './DraftConstants';

import { getSelectedBlock } from './operation/Selection';
import { toggleBlockType, insertNewBlock, createBlock } from './operation/Block';

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
    const currentBlock = this.currentBlock;
    const currentBlockMeta = this.currentBlockMeta;

    const editorState = this.getEditorState();
    const selection = editorState.getSelection();

    if (currentBlockMeta.inline) {
      this.onChange(insertNewBlock(editorState, createBlock()));
      return HANDLED;
    }

    if (isSoftNewlineEvent(event)) {
      this.onChange(RichUtils.insertSoftNewline(editorState));
      return HANDLED;
    }

    if (event.altKey || event.metaKey || event.ctrlKey) {
      return NOT_HANDLED;
    }

    const blockType = currentBlock.getType();
    const blockLength = currentBlock.getLength();
    if (blockType !== BlockType.UNSTYLED && blockLength === 0) {
      this.onChange(toggleBlockType(editorState, BlockType.UNSTYLED));
      return HANDLED;
    }

    // 行内换行，插入 soft newline
    if (currentBlock.getLength() === 0 && currentBlock.getLength() === 0) {
      this.onChange(insertNewBlock(editorState, createBlock()));
      return HANDLED;
    }

    // 行尾换行
    if (selection.isCollapsed() && blockLength === selection.getStartOffset()) {
      if (currentBlockMeta.blockInherit) {
        this.onChange(insertNewBlock(editorState, createBlock()));
        return HANDLED;
      }
    }
  
    return NOT_HANDLED;
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
