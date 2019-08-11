import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { reducer } from './store';
import Root from './Views/Root';

import './index.scss';

const store = createStore(reducer);

ReactDOM.render(<Provider store={store}>
	<Root />
</Provider>, document.getElementsByTagName('main')[0]);
