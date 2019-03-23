import React, { Component } from 'react';
import { Text, View } from 'react-native';
import Constants from 'expo';
import axios from 'axios';
import _ from 'lodash';

export default class RiddlesTreasures extends Component {

  render() {
    return (
      <View>
        {/* {_.map(this.props.treasures, treasure => {
          return (
            <View>
              <View>
                <Text>Treasure: {treasure.id}</Text>
                <Text>Gold Value: {treasure.gold_value}</Text>
              </View>
              <View>
                {_.find(this.props.riddles, riddle => riddle.id_treasure === treasure.id) ?
                  <View>
                    <Text>Riddle: {_.find(this.props.riddles, riddle => riddle.id_treasure === treasure.id).id}</Text>
                    <Text>Views: {_.find(this.props.riddles, riddle => riddle.id_treasure === treasure.id).views}</Text>
                  </View>
                  :
                  <Text />
                }
              </View>
            </View>
          );
        })} */}
      </View>
    );
  }
}