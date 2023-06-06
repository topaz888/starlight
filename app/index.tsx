import React from 'react';
import AppNavigator from './app.navigator';
import { Provider as PaperProvider } from 'react-native-paper';

const Home = () => {

  return (
    <PaperProvider>
      <AppNavigator />
    </PaperProvider>
  );
}

export default Home;