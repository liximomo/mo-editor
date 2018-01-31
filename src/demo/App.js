import React, { Component } from 'react';
import MoEditor, {
  createEditorState,
  convertToDocumentModel,
  convertFromDocumentModel,
} from '../lib';

const STORAGE_KEY = '@contentModel';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: createEditorState(JSON.parse(localStorage.getItem(STORAGE_KEY)), convertFromDocumentModel),
    };
  }

  componentDidMount() {
    setInterval(() => {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(convertToDocumentModel(this.state.editorState.getCurrentContent()))
      );
      console.log('saved');
    }, 10 * 1000);
  }

  onChange = editorState => {
    this.setState({
      editorState,
    });
  };

  render() {
    return (
      <div className="App">
        <MoEditor editorState={this.state.editorState} onChange={this.onChange} />
      </div>
    );
  }
}

export default App;
