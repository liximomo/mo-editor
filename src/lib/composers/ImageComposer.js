import React, { Component } from 'react';
import Control from '../Control';
import Button from '../components/Button';
import IconImage from '../components/icons/IconImage';
import { replaceCurrentBlockIfEmpty } from '../operation/BLock';
import { IMAGE } from '../blocks/TypeOfBlock';

class ImageComposer extends Component {
  handleButtonClick = () => {
    this._inputNode.value = null;
    this._inputNode.click();
  };

  handleFileChange = event => {
    const file = event.target.files[0];

    if (!/image\/\w+/i.test(file.type)) {
      alert('不支持的图片格式！');
      return;
    }

    const { editorState, setEditorState } = this.props;

    const src = URL.createObjectURL(file);
    setEditorState(
      replaceCurrentBlockIfEmpty(editorState, IMAGE, {
        src,
      })
    );
  };

  setInputNode = node => {
    this._inputNode = node;
  };

  render() {
    return [
      <Button key="btn" icon={IconImage} onClick={this.handleButtonClick} />,
      <input
        style={{ display: 'none' }}
        key="input"
        ref={this.setInputNode}
        type="file"
        accept="image/*"
        onChange={this.handleFileChange}
      />,
    ];
  }
}

export default {
  id: 'img',
  title: '插入图片',
  element: <Control component={ImageComposer} />,
};
