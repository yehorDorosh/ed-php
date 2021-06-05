import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import App from './App';
import GlobalProvider from './store/GlobalProvider';
import store from './store/index';

import './styles/normalize.css';
import './styles/utils/display.scss';
import './styles/index.scss';


ReactDOM.render( 
  <Provider store={store}>
    <GlobalProvider>
      <App />
    </GlobalProvider>
  </Provider>
, document.getElementById('root'));