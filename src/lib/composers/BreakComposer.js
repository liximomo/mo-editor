import React, { Component } from 'react';
import Control from '../Control';
import Button from '../components/Button';
import IconBreak from '../components/icons/IconBreak';
import { removeCurrentAndInsertAtomicBlock } from '../operation/Block';
import AtomicBlockBreakPlugin from '../blocks/plugins/AtomicBlockBreakPlugin';

class BreakComposer extends Component {
  handleButtonClick = () => {
    const { editorState, setEditorState } = this.props;
    const { newEditorState, entityKey } = AtomicBlockBreakPlugin.createEntity(editorState);
    setEditorState(removeCurrentAndInsertAtomicBlock(newEditorState, entityKey, ' '));
  };

  render() {
    return <Button key="btn" icon={IconBreak} onClick={this.handleButtonClick} />;
  }
}

export default {
  id: AtomicBlockBreakPlugin.type,
  title: '插入分隔符',
  element: <Control component={BreakComposer} />,
};
