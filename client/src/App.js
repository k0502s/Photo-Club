import React from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import store, { history } from './store';
import MyRouter from './components/Myrouter/Router';
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/custom.scss';
import GlobalStyle from './assets/GlobalStyle';

const App = () => {
    return (
        <Provider store={store}>
            <ConnectedRouter history={history}>
                <GlobalStyle />
                <MyRouter />
            </ConnectedRouter>
        </Provider>
    );
};

export default App;
