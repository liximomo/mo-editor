import React, { Component } from 'react';
import { EditorState, SelectionState } from 'draft-js';
import Control from '../Control';
import Button from '../components/IconButton';
import IconBreak from '../components/icons/IconBreak';
import { getSelectedBlock } from '../operation/Selection';
import { replaceWithAtomicBlockAndInsertEmptyBlock, replaceWithAtomicBlock, getNextBlock } from '../operation/Block';
import AtomicBlockBreakPlugin from '../blocks/plugins/AtomicBlockBreakPlugin';
import BlockHub from '../blocks/BlockHub';

class InsertComposerBreak extends Component {
  handleButtonClick = () => {
    const { editorState, setEditorState, onInsertDone } = this.props;
    const blockPlugin = BlockHub.getAtomicBlockPlugin(AtomicBlockBreakPlugin.type);
    const { newEditorState, entityKey } = blockPlugin.createEntity(editorState);

    const currentBlock = getSelectedBlock(editorState);
    let nextBlock = getNextBlock(currentBlock, editorState.getCurrentContent());
    let withBreak;
    if (nextBlock) {
      withBreak = replaceWithAtomicBlock(newEditorState, entityKey, ' ');
      const newSelection = new SelectionState({
        anchorKey: nextBlock.getKey(),
        focusKey: nextBlock.getKey(),
        anchorOffset: 0,
        focusOffset: 0,
      });
      withBreak = EditorState.forceSelection(withBreak, newSelection);
    } else {
      // 最后一行
      withBreak = replaceWithAtomicBlockAndInsertEmptyBlock(newEditorState, entityKey, ' ');
    }
    setEditorState(withBreak, onInsertDone);
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
