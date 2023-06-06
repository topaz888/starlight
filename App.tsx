import React from 'react';
import {Provider} from 'react-redux';
import {store} from './app/redux/store';
import Home from './app/index'


const App = () => {
  return (
    <Provider store={store}>
      <Home/>
    </Provider> 
  );
}

export default App;
