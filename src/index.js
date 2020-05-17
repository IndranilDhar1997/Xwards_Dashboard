import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/main/App';
import * as serviceWorker from './js/lib/serviceWorker';

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
