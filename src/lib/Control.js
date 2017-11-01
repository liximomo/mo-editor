import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Control extends Component {
  static propTypes = {
    render: PropTypes.func,
    component: PropTypes.func,
  };

  static contextTypes = {
    editorState: PropTypes.object.isRequired,
    setEditorState: PropTypes.func.isRequired,
    getEditor: PropTypes.func.isRequired,
  };

  render() {
    const { component, render } = this.props;
    const { editorState, setEditorState, getEditor } = this.context;
    const props = { editorState, setEditorState, getEditor };

    if (component) return React.createElement(component, props);

    if (render) return render(props);
  }
}

export default Control;
