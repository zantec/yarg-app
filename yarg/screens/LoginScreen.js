import React from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import { NavigationEvents } from 'react-navigation';
import axios from 'axios';

import Login from '../components/Login'

export default class MapScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  // Render any loading content that you like here
  render() {
    return (
      <View style={{ flex: 1 }}>
        <Login />
      </View>
    );
  }
}