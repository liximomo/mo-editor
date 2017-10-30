import PropTypes from 'prop-types';
import React from 'react';

import { EditorBlock, EditorState, SelectionState } from 'draft-js';

import { getCurrentBlock } from '../operation/Block';

class BlockImage extends React.Component {
  static propTypes = {
    block: PropTypes.object,
    blockProps: PropTypes.object,
  };

  // focusBlock = () => {
  //   const { block, blockProps } = this.props;
  //   const { getEditorState, setEditorState } = blockProps;
  //   const key = block.getKey();
  //   const editorState = getEditorState();
  //   const currentblock = getCurrentBlock(editorState);
  //   if (currentblock.getKey() === key) {
  //     return;
  //   }
  //   const newSelection = new SelectionState({
  //     anchorKey: key,
  //     focusKey: key,
  //     anchorOffset: 0,
  //     focusOffset: 0,
  //   });
  //   setEditorState(EditorState.forceSelection(editorState, newSelection));
  // };

  handleKeyDown(event) {
    console.log('keydown in imge');
  }

  render() {
    const { block } = this.props;
    const data = block.getData();
    const src = data.get('src');
    if (src !== null) {
      return [
        <img key="img" role="presentation" src={src} />,
        <figcaption key="figcaption" onKeyDown={this.handleKeyDown}>
          <EditorBlock {...this.props} />
        </figcaption>,
      ];
    }
    return <EditorBlock {...this.props} />;
  }
}

export default BlockImage;
