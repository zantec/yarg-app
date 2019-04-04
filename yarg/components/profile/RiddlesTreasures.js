import React, { Component } from 'react';
import { Text, View, ImageBackground, StyleSheet, ScrollView } from 'react-native';
import Constants from 'expo';
import axios from 'axios';
import _ from 'lodash';
import { Button, Overlay } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Foundation';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';

const user = {
  "id": 2,
  "username": "acreed1998",
  "gold": 300050,
  "avatar": "https://imgur.com/KfhK2Br.png",
  "treasures_placed": 6,
  "treasures_claimed": 0,
  "riddles_placed": 0,
  "higest_gold": 0,
  "highest_treasure_found": 0,
  "treasures": [
    {
      "id": 23,
      "gold_value": 555,
      "date_created": "2019-04-02T16:20:27.000Z",
      "date_claimed": "2000-01-01T00:00:00.000Z",
      "id_location": 40,
      "id_user": 2,
      "location_data": {
        "id": 40,
        "category": "treasure",
        "longitude": -90.0759,
        "latitude": 29.9774,
        "address": "2539 Columbus St.",
        "city": "New Orleans",
        "state": "LA",
        "zipcode": 70119
      }
    }
  ],
  "riddles": [
    {
      "id": 19,
      "title": "What am I?",
      "date_created": "2019-04-02T16:21:31.000Z",
      "views": 0,
      "riddle": "The booty be hidden,\nWhen found ye' will sing,\nBe in a bowl on a table,\nBeneath ye' olde' orange thing!",
      "id_treasure": 23,
      "id_location": 41,
      "id_user": 2,
      "location_data": {
        "id": 41,
        "category": "riddle",
        "longitude": -90.0759,
        "latitude": 29.9774,
        "address": "2539 Columbus St.",
        "city": "New Orleans",
        "state": "LA",
        "zipcode": 70119
      }
    }
  ],
  "inventory": {
    "items": [],
    "riddles": []
  }
}
const screenProps = {
  user: user,
};

export default class RiddlesTreasures extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      riddleModalVisible: false,
      treasure: {},
      riddle: {},
      exclude: [],
    };
    this.onClose = this.onClose.bind(this);
    this.onOpen = this.onOpen.bind(this);
    this.deleteTreasure = this.deleteTreasure.bind(this);
    this.deleteRiddle = this.deleteRiddle.bind(this);
    this.onRiddleOpen = this.onRiddleOpen.bind(this);
    this.onRiddleClose = this.onRiddleClose.bind(this);
  }

  onOpen() {
    this.setState({ modalVisible: true });
  }

  onRiddleOpen() {
    this.setState({ riddleModalVisible: true });
  }

  onClose() {
    this.setState({ modalVisible: false });
  }

  onRiddleClose() {
    this.setState({ riddleModalVisible: false });
  }

  deleteTreasure(id_treasure) {
    axios.delete(`http://ec2-3-17-167-48.us-east-2.compute.amazonaws.com/user/treasure?id_treasure=${id_treasure}`).then(res => {
      axios({
        url: `http://ec2-3-17-167-48.us-east-2.compute.amazonaws.com/user/gold`,
        method: 'patch',
        data: {
          username: this.props.screenProps.user.username,
          amount: this.state.treasure.gold_value,
        },
      }).then(updatedUser => {
        this.props.screenProps.updateUser();
      }).catch(err => {
        console.log(err);
        this.props.screenProps.updateUser();
      });
    }).catch(err => {
      console.log(err);
      this.props.screenProps.updateUser();
    });
  }

  deleteRiddle(id_riddle) {
    axios.delete(`http://ec2-3-17-167-48.us-east-2.compute.amazonaws.com/user/riddle?id_riddle=${id_riddle}`).then(res => {
      this.props.screenProps.updateUser();
    }).catch(err => {
      console.log(err);
      this.props.screenProps.updateUser();
    });
  }

  render() {
    return (
      <ImageBackground style={style.backgroundImage} source={{ uri: 'https://imgur.com/LFmIDsn.jpg' }}>
        <ScrollView contentContainertyle={{ alignItems: 'center', justifyContent: 'center' }} overScrollMode='always'>
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
                    <Text>alsk;dfj</Text>
                    {_.find(this.props.screenProps.user.riddles, riddle => riddle.id_treasure === treasure.id) ?
                      <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View>
                          <Text>Riddle: {_.find(this.props.screenProps.user.riddles, riddle => riddle.id_treasure === treasure.id).title}</Text>
                          <Text>Views: {_.find(this.props.screenProps.user.riddles, riddle => riddle.id_treasure === treasure.id).views}</Text>
                        </View>
                        <View style={{ width: 70, alignItems: 'center' }}>
                          <MaterialIcon.Button
                            size={20}
                            iconStyle={{ paddingLeft: 10 }}
                            name="skull"
                            onPress={() => {
                              this.setState({ riddle: _.find(this.props.screenProps.user.riddles, riddle => riddle.id_treasure === treasure.id) });
                              this.onRiddleOpen();
                            }}
                          />
                        </View>
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
            <Overlay isVisible={this.state.riddleModalVisible} closeOnTouchOutside onBackdropPress={this.onRiddleClose} overlayBackgroundColor={'rgba(52, 52, 52, 0.0)'}>
              <View style={{ height: '100%', width: '100%', backgroundColor: 'rgba(52, 52, 52, 0.8)', alignContent: 'center' }}>
                <ImageBackground style={style.otherBackground} source={{ uri: 'https://imgur.com/LFmIDsn.jpg' }}>
                  <ScrollView contentContainertyle={{ alignItems: 'center', justifyContent: 'center' }} overScrollMode='always'>
                    <Text>{`Are you sure you want to delete this riddle?`}</Text>
                    <Button title={'Yes, Delete the Riddle'} onPress={() => {
                      this.deleteRiddle(this.state.riddle.id);
                      this.onRiddleClose();
                    }} />
                  </ScrollView>
                </ImageBackground>
              </View>
            </Overlay>
          </View>
        </ScrollView>
      </ImageBackground>
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
