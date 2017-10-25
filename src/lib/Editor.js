import PropTypes from 'prop-types';

import React, { Component } from 'react';
import { Editor as Draft } from 'draft-js';

import createEditorState from './createEditorState';
import decorators from './decorators';
import blockRenderMap from './blocks/blockRenderMap';
import * as BlockType from './blocks/TypeOfBlock';

import Popover from './components/Popover';
import Toolbar from './components/Toolbar';
import AddBlockButton from './components/AddBlockButton';

import LinkComposer from './composers/LinkComposer';
import createBlockComposer from './composers/createBlockComposer';
import ImageComposer from './composers/ImageComposer';

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
  LinkComposer,
];

const defaultBlockButtons = [ImageComposer];

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

  focus = () => {
    return this.getEditor().focus();
  };

  getEditorState = () => {
    return this.state.editorState;
  };

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
          />
          <AddBlockButton
            active={this.shouldActiveAddBlockButton()}
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
          <Popover positionNode={this._editorContainer} />
        </div>
      </div>
    );
  }
}
