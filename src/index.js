import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import GlobalProvider from './store/GlobalProvider';

import './styles/normalize.css';
import './styles/utils/display.scss';
import './styles/index.scss';


ReactDOM.render( 
  <GlobalProvider>
    <App />
  </GlobalProvider>
, document.getElementById('root'));