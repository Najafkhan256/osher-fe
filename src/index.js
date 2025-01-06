import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {Router } from 'react-router-dom';
import Application from './Components/application';
import reportWebVitals from './reportWebVitals';
import history from '../src/services/history';

ReactDOM.render(
  <React.StrictMode>
    <Router history={history}>
      <Application />
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
