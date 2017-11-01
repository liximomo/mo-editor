import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import MoEditor from '../lib';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<MoEditor placeholder={'开始写吧'} />, document.getElementById('root'));
registerServiceWorker();
