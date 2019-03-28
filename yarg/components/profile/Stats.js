import React, { Component } from 'react';
import { Text, View, Image, StyleSheet, ImageBackground } from 'react-native';
import Constants from 'expo';
import axios from 'axios';

export default class Stats extends Component {
  constructor(props) {
    super(props);
    // this.props.user = {};
    // this.props.user.username = 'AND HIS NAME IS JOHN CENA!!!!!!!!';
    // this.props.user.gold = 100000;
  }

  componentDidMount() {
  }

  render() {
    return (
      <ImageBackground source={{ uri: 'https://imgur.com/O15IDs5.jpg' }} style={style.backgroundImage}>
        <View style={style.holder}>
          <Text>{this.props.screenProps.username}'s Stats:</Text>
          <View>
            <Image source={{ uri: 'https://imgur.com/KfhK2Br.png' }}
              style={{ width: 100, height: 50 }} />
            <Text>
              Username: {this.props.screenProps.username}
            </Text>
          </View>
          <Text>Gold: {this.props.screenProps.goldAmount}</Text>
        </View>
      </ImageBackground>
    );
  }
}

const style = StyleSheet.create({
  holder: {
    height: '100%',
  },
  backgroundImage: {
    height: '100%',
    width: '100%',
    flex: 1,
  }
});
