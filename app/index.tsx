import React from 'react';
import AppNavigator from './app.navigator';
// import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider, initialWindowMetrics } from 'react-native-safe-area-context'


const Home = () => {
  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
        <AppNavigator/>
    </SafeAreaProvider>
  );
}

export default Home;