import React from 'react';
import { AppLoading } from 'expo';
import { StyleSheet } from 'react-native';
import { Ubuntu_700Bold, useFonts} from '@expo-google-fonts/ubuntu';
import { Roboto_400Regular, Roboto_500Medium } from '@expo-google-fonts/roboto';

import Home from './src/pages/Home/index';

export default function App() {
  const [fontsLoaded] = useFonts({
    Ubuntu_700Bold,
    Roboto_400Regular,
    Roboto_500Medium

  });

  if(!fontsLoaded) {
    return <AppLoading />;
  }
  return (
    <Home />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4876',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
