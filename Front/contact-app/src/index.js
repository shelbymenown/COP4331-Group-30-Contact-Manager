import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/lib/integration/react';
import { BrowserRouter } from 'react-router-dom';
import { persistor, store } from './store/configureStore';
import App from './containers/App';
import './index.css';
import registerServiceWorker from './registerServiceWorker';


const app = (
    <PersistGate persistor={persistor}>
        <Provider store={store}>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </Provider>
    </PersistGate>
);

ReactDOM.render(app, document.getElementById('root'));
registerServiceWorker();
