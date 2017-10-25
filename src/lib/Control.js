import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Control extends Component {
  static propTypes = {
    render: PropTypes.func,
    component: PropTypes.func,
  };

  static contextTypes = {
    editor: PropTypes.shape({
      editorState: PropTypes.object.isRequired,
      setEditorState: PropTypes.func.isRequired,
    }),
  };

  render() {
    const { component, render } = this.props;
    const { editorState, setEditorState } = this.context.editor;
    const props = { editorState, setEditorState };

    if (component) return React.createElement(component, props);

    if (render) return render(props);
  }
}

export default Control;
