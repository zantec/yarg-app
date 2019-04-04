import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Button
} from 'react-native';
import { NavigationEvents } from 'react-navigation';
import axios from 'axios';

import Map from '../components/Map.js'
import RiddleModal from '../components/RiddleModal.js'
import Gold from '../components/Gold.js'

export default class MapScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  // Render any loading content that you like here
  render() {
    return (
      <View style={{flex: 1}}>
        <Map 
        treasures={this.props.screenProps.treasures}
        riddles={this.props.screenProps.riddles}
        getGold={this.props.screenProps.getGold}
        goldAmount={this.props.screenProps.goldAmount}
        user={this.props.screenProps.user}
        />
        <RiddleModal riddles={this.props.screenProps.riddles.map(riddle => riddle.riddle)[0]}/>
        <NavigationEvents
          onWillFocus={() => {
            this.props.screenProps.getGold();
          }}
        />
        <Gold goldAmount={this.props.screenProps.goldAmount} />
      
      </View>
    );
  }
}