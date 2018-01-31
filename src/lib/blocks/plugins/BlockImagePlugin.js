import PropTypes from 'prop-types';
import React from 'react';
import { EditorState, EditorBlock, SelectionState } from 'draft-js';
import { IMAGE } from '../TypeOfBlock';
import { getSelectedBlock } from '../../operation/Selection';

class BlockImage extends React.Component {
  static propTypes = {
    block: PropTypes.object,
    blockProps: PropTypes.object,
  };

  componentDidMount() {
    this.focusBlock();
  }

  focusBlock = () => {
    const { block, blockProps } = this.props;
    const { getEditorState, setEditorState } = blockProps;
    const key = block.getKey();
    const editorState = getEditorState();
    const currentblock = getSelectedBlock(editorState);
    if (currentblock.getKey() === key) {
      return;
    }

    const newSelection = new SelectionState({
      anchorKey: key,
      focusKey: key,
      anchorOffset: 0,
      focusOffset: 0,
    });
    setEditorState(EditorState.forceSelection(editorState, newSelection));
  };

  render() {
    const { block } = this.props;
    const data = block.getData();
    const src = data.get('src');
    if (src !== null) {
      /* eslint-disable */
      return (
        <div className="MoImage">
          <img role="presentation" src={src} onClick={this.focusBlock} />
          <figcaption>
            <EditorBlock {...this.props} />
          </figcaption>
        </div>
      );
      /* eslint-enable */
    }
    return <EditorBlock {...this.props} />;
  }
}

export default {
  type: IMAGE,
  renderer: {
    component: BlockImage,
  },
};
