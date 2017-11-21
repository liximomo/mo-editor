import React, { Component } from 'react';
import Control from '../Control';
import Button from '../components/IconButton';
import IconBreak from '../components/icons/IconBreak';
import { removeCurrentAndInsertAtomicBlock } from '../operation/Block';
import AtomicBlockBreakPlugin from '../blocks/plugins/AtomicBlockBreakPlugin';
import BlockHub from '../blocks/BlockHub';

class InsertComposerBreak extends Component {
  handleButtonClick = () => {
    const { editorState, setEditorState, onInsertDone } = this.props;
    const blockPlugin = BlockHub.getAtomicBlock(AtomicBlockBreakPlugin.type);
    const { newEditorState, entityKey } = blockPlugin.createEntity(editorState);
    setEditorState(removeCurrentAndInsertAtomicBlock(newEditorState, entityKey, ' '), onInsertDone);
  };

  render() {
    return <Button icon={IconBreak} onClick={this.handleButtonClick} />;
  }
}

export default {
  id: AtomicBlockBreakPlugin.type,
  title: '插入分隔符',
  render: props => (
    <Control render={injectProps => <InsertComposerBreak {...injectProps} {...props} />} />
  ),
};
