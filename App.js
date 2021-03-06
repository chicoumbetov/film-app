import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Search from "./Components/Search";
import Navigation from "./Navigation/Navigation";
import { Provider } from "react-redux";
import Store from './Store/configureStore'

export default function App() {
  return (
      <Provider store={Store} >
        <Navigation />
      </Provider>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
