import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './input-number.less';
import 'react-loading-skeleton/dist/skeleton.css'
import App from './App';
import axios from 'axios';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
axios.defaults.withCredentials = true

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <App  />
);
