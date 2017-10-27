import React, { Component } from 'react';
import ServiceHub from '../services/ServiceHub';
import Control from '../Control';
import Button from '../components/Button';
import IconImage from '../components/icons/IconImage';
import { replaceCurrentBlock } from '../operation/BLock';
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

    ServiceHub.uploadImage(file).then(img => {
      const { url } = img;
      setEditorState(
        replaceCurrentBlock(editorState, IMAGE, {
          src: url,
        })
      );
    });
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
  id: IMAGE,
  title: '插入图片',
  element: <Control component={ImageComposer} />,
};
