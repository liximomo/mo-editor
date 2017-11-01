import React, { Component } from 'react';
import Control from '../Control';
import Button from '../components/Button';
import IconBreak from '../components/icons/IconBreak';
import { removeCurrentAndInsertNewBlock } from '../operation/Block';
import { ATOMIC, ATOMIC_BREAK } from '../blocks/TypeOfBlock';

class BreakComposer extends Component {
  handleButtonClick = () => {
    const { editorState, setEditorState } = this.props;
    setEditorState(removeCurrentAndInsertNewBlock(editorState, ATOMIC, { type: ATOMIC_BREAK }));
  };

  render() {
    return <Button key="btn" icon={IconBreak} onClick={this.handleButtonClick} />;
  }
}

export default {
  id: ATOMIC_BREAK,
  title: '插入分隔符',
  element: <Control component={BreakComposer} />,
};
