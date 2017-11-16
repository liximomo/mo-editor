import React, { Component } from 'react';
import Control from '../Control';
import Button from '../components/IconButton';
import IconBreak from '../components/icons/IconBreak';
import { removeCurrentAndInsertAtomicBlock } from '../operation/Block';
import AtomicBlockBreakPlugin from '../blocks/plugins/AtomicBlockBreakPlugin';

class InsertComposerBreak extends Component {
  handleButtonClick = () => {
    const { editorState, setEditorState, onInsertDone } = this.props;
    const { newEditorState, entityKey } = AtomicBlockBreakPlugin.createEntity(editorState);
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
