import React from 'react';
import {Provider} from 'react-redux';
import {store} from './app/redux/store';
import Home from './app/index'
import { Text } from 'react-native';

interface TextWithDefaultProps extends Text {
  defaultProps?: { allowFontScaling?: boolean };
}

((Text as unknown) as TextWithDefaultProps).defaultProps =
((Text as unknown) as TextWithDefaultProps).defaultProps || {};
((Text as unknown) as TextWithDefaultProps).defaultProps!.allowFontScaling = false;

const App = () => {
  return (
    <Provider store={store}>
      <Home/>
    </Provider> 
  );
}

export default App;
