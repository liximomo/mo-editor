import React, { Component } from 'react';
import Control from '../Control';
import Button from '../components/Button';
import IconImage from '../components/icons/IconImage';
import { replaceCurrentBlock } from '../operation/BLock';
import { BREAK } from '../blocks/TypeOfBlock';

class BreakComposer extends Component {
  handleButtonClick = () => {
    const { editorState, setEditorState } = this.props;
    setEditorState(replaceCurrentBlock(editorState, BREAK));
  };

  render() {
    return <Button key="btn" icon={IconImage} onClick={this.handleButtonClick} />;
  }
}

export default {
  id: BREAK,
  title: '插入分隔符',
  element: <Control component={BreakComposer} />,
};
