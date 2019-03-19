import React from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import Login from '../components/Login.js'

export default class AuthScreen extends React.Component {
  constructor(props) {
    super(props);
  }

  // Render any loading content that you like here
  render() {
    return (
      <View>
        <Login />
      </View>
    );
  }
}