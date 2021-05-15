import React from 'react';
import ReactDOM from 'react-dom';

import './styles/normalize.css';
import './styles/index.scss';
import App from './App';

window.localEnv = 'http://localhost:7777';
window.prodEnv = 'http://35.178.207.100';
window.host = window.ENV_MODE ? window.prodEnv : window.localEnv;

ReactDOM.render(<App />, document.getElementById('root'));