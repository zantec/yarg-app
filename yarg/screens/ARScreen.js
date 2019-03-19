import React from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import ARView from '../components/ARView.js'
import Gold from '../components/Gold.js'

export default class ARScreen extends React.Component {
  constructor(props) {
    super(props);
  }

  // Render any loading content that you like here
  render() {
    return (
      <View style={{flex: 1}}>
        <ARView />
        <Gold/>
      </View>
    );
  }
}