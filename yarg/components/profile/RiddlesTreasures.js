import React, { Component } from 'react';
import { Text, View, StyleSheet, ImageBackground, ScrollView } from 'react-native';
import Constants from 'expo';
import axios from 'axios';
import _ from 'lodash';

export default class RiddlesTreasures extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <ImageBackground source={{ uri: 'https://imgur.com/O15IDs5.jpg' }} style={style.backgroundImage}>
        <ScrollView contentContainerStyle={{ alignItems: 'center', justifyContent: 'center' }} overScrollMode='always'>
          {_.map(this.props.screenProps.treasures, treasure => {
            return (
              <View key={treasure.id}>
                <View>
                  <Text>Treasure: {treasure.id}</Text>
                  <Text>Gold Value: {treasure.gold_value}</Text>
                </View>
                <View>
                  {_.find(this.props.screenProps.riddles, riddle => riddle.id_treasure === treasure.id) ?
                    <View>
                      <Text>Riddle: {_.find(this.props.screenProps.riddles, riddle => riddle.id_treasure === treasure.id).id}</Text>
                      <Text>Views: {_.find(this.props.screenProps.riddles, riddle => riddle.id_treasure === treasure.id).views}</Text>
                    </View>
                    :
                    <Text />
                  }
                </View>
              </View>
            );
          })}
        </ScrollView>
      </ImageBackground>
    );
  }
}

const style = StyleSheet.create({
  backgroundImage: {
    height: '100%',
    width: '100%',
    flex: 1,
  }
});
