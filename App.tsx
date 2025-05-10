import React from 'react';
import AppRun from './Buoi5/AppRun';
import { Provider as PaperProvider } from 'react-native-paper';

const App = () => {
  return (
    <PaperProvider>
      <AppRun />
    </PaperProvider>
  );
}

export default App;