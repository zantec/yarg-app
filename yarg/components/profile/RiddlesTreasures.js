import React, { Component } from 'react';
import { Text, View, ImageBackground, StyleSheet, ScrollView } from 'react-native';
import Constants from 'expo';
import axios from 'axios';
import _ from 'lodash';
import { Button, Overlay } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Foundation';

export default class RiddlesTreasures extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      treasure: {},
      exclude: [],
    };
    this.onClose = this.onClose.bind(this);
    this.onOpen = this.onOpen.bind(this);
    this.deleteTreasure = this.deleteTreasure.bind(this);
  }

  onOpen() {
    this.setState({ modalVisible: true });
  }

  onClose() {
    this.setState({ modalVisible: false });
  }

  deleteTreasure(id_treasure) {
    console.log(id_treasure);
    axios.delete(`http://ec2-3-17-167-48.us-east-2.compute.amazonaws.com/user/treasure?id_treasure=${id_treasure}`).then(res => {
      this.props.screenProps.updateUser();
    }).catch(err => {
      console.log(err);
    });
  }

  render() {
    return (
      <View>
        {_.map(this.props.screenProps !== undefined ? this.props.screenProps.user.treasures : [], treasure => {
          return (
            <View>
              <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                <View>
                  <Text>Treasure: {treasure.id}</Text>
                  <Text>Gold Value: {treasure.gold_value}</Text>
                </View>
                <View style={{ width: 75, alignItems: 'center' }}>
                  <Icon.Button
                    size={20}
                    iconStyle={{ paddingLeft: 10 }}
                    name="skull"
                    onPress={() => {
                      this.setState({ treasure: treasure });
                      this.onOpen();
                    }}
                  />
                </View>
              </View>

              <View>
                {_.find(this.props.screenProps.user.riddles, riddle => riddle.id_treasure === treasure.id) ?
                  <View>
                    <Text>Riddle: {_.find(this.props.riddles, riddle => riddle.id_treasure === treasure.id).title}</Text>
                    <Text>Views: {_.find(this.props.riddles, riddle => riddle.id_treasure === treasure.id).views}</Text>
                  </View>
                  :
                  <Text />
                }
              </View>
            </View>
          )
        })}
        <Overlay isVisible={this.state.modalVisible} closeOnTouchOutside onBackdropPress={this.onClose} overlayBackgroundColor={'rgba(52, 52, 52, 0.0)'}>
          <View style={{ height: '100%', width: '100%', backgroundColor: 'rgba(52, 52, 52, 0.8)', alignContent: 'center' }}>
            <ImageBackground style={style.otherBackground} source={{ uri: 'https://imgur.com/LFmIDsn.jpg' }}>
              <ScrollView contentContainertyle={{ alignItems: 'center', justifyContent: 'center' }} overScrollMode='always'>
                <Text>{`Deleting this treasure will delete any riddle associated with it.`}</Text>
                <Text>{`Are you sure?`}</Text>
                <Button title={'Yes, Delete the Treasure'} onPress={() => {
                  this.deleteTreasure(this.state.treasure.id);
                  this.onClose();
                }} />
              </ScrollView>
            </ImageBackground>
          </View>
        </Overlay>
      </View>
    );
  }
}

const style = StyleSheet.create({
  holder: {
    height: '100%',
    alignContent: 'center',
    flex: 1,
  },
  // title: { flex: 1, backgroundColor: '#ffffff' },
  // wrapper: { flexDirection: 'row' },
  backgroundImage: {
    height: '100%',
    width: '100%',
    flex: 1,
  },
  otherBackground: {
    flex: 2
  },
  pirateText: {
    fontSize: 26,
    fontFamily: 'treamd',
  },
  biggerPirateText: {
    fontSize: 50,
    fontFamily: 'treamd',
  }
});
