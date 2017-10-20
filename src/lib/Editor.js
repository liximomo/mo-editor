import React, { Component } from 'react';
import { Editor as Draft } from 'draft-js';

import createEditorState from './createEditorState';
import decorators from './decorators';
import commander from './commands/CommandHub';
import Popover from './ui/Popover';

import 'draft-js/dist/Draft.css';
import './Editor.scss';

export default class Editor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isPopoverActive: false,
      popoverView: 'test',
      editorState: createEditorState(null, null, decorators),
    };
  }

  setEditorInstance = instance => {
    this._editor = instance;
  };

  setEditorContainerNode = node => {
    this._editorContainer = node;
  }

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
    this.setState({ editorState }, this.focus);
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
    const { popoverView } = this.state;

    const selection = editorState.getSelection();
    return (
      <div className="MoEditor">
        <div className="toolbar">
          <button onClick={_ => this.handleChange(commander.setLink(editorState, 'www.baidu.com'))}>
            link
          </button>
        </div>
        <div className="MoEditor__editorContainer" ref={this.setEditorContainerNode}>
          <Draft
            ref={this.setEditorInstance}
            editorState={this.state.editorState}
            onChange={this.handleChange}
          />
          <Popover active={this.shouldActivePopover()} positionNode={this._editorContainer} selection={selection}>
            {popoverView}
          </Popover>
        </div>
      </div>
    );
  }
}
