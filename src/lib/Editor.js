import PropTypes from 'prop-types';

import React, { Component } from 'react';
import { Editor as Draft } from 'draft-js';

import createEditorState from './createEditorState';
import blockRenderMap from './blocks/blockRenderMap';
import decorators from './decorators';
import Popover from './ui/Popover';
import Toolbar from './Toolbar';
import LinkComposer from './composers/LinkComposer';
import createBlockComposer from './composers/createBlockComposer';
import * as BlockType from './blocks/TypeOfBlock';

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

export default class Editor extends Component {
  static propTypes = {
    buttons: PropTypes.arrayOf(PropTypes.string),
  };

  static defaultProps = {
    active: false,
    direction: 'top',
    offset: 5,
  };

  constructor(props) {
    super(props);

    this.state = {
      isPopoverActive: false,
      editorState: createEditorState(null, null, decorators),
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

  handleChange = editorState => {
    this.setState({ editorState }, () => {
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

  render() {
    const editorState = this.getEditorState();

    const selection = editorState.getSelection();
    return (
      <div className="MoEditor">
        <div className="MoEditor__editorContainer" ref={this.setEditorContainerNode}>
          <Draft
            ref={this.setEditorInstance}
            editorState={this.state.editorState}
            onChange={this.handleChange}
            blockRenderMap={blockRenderMap}
          />
          <Popover
            active={this.shouldActivePopover()}
            positionNode={this._editorContainer}
            selection={selection}
          >
            <Toolbar
              items={defaultButtons}
              editorState={editorState}
              setEditorState={this.handleChange}
            />
          </Popover>
        </div>
      </div>
    );
  }
}
