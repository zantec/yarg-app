import React, { Component } from 'react';
import { Text, View, Image, StyleSheet, ImageBackground } from 'react-native';
import Constants from 'expo';
import axios from 'axios';

export default class Stats extends Component {
  constructor(props) {
    super(props);
    props.user = {};
    props.user.username = 'AND HIS NAME IS JOHN CENA!!!!!!!!';
    props.user.gold = 100000;
  }

  render() {
    return (
      <ImageBackground source={{ uri: 'https://imgur.com/O15IDs5.jpg' }} style={style.backgroundImage}>
        <View style={style.holder}>
          <Text>{this.props.user.username}'s Stats:</Text>
          <View>
            <Image source={{ uri: 'https://imgur.com/KfhK2Br.png' }}
              style={{ width: 50, height: 50, borderRadius: 40 }} />
            <Text>
              Username: {this.props.user.username}
            </Text>
          </View>
          <Text>Gold: {this.props.user.gold}</Text>
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
