import React from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import Map from '../components/Map.js'
import RiddleModal from '../components/RiddleModal.js'

export default class AuthScreen extends React.Component {
  constructor(props) {
    super(props);
  }

  // Render any loading content that you like here
  render() {
    return (
      <View style={{flex: 1}}>
        <Map />
        <RiddleModal/>
      </View>
    );
  }
}