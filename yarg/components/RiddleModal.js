import React, { Component } from 'react';
import { Modal, Text, TouchableHighlight, View, Alert, ImageBackground, StyleSheet, ScrollView, Image } from 'react-native';
import Axios from 'axios';
import _ from 'lodash';
import { Button, Overlay } from 'react-native-elements';
import { Constants, Font } from 'expo';

export default class RiddleModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentRiddle: '',
      fontLoaded: false,
      modalVisible: false,
      showRiddleBoard: false,
      riddleBoardRiddles: [],
      otherModalVisible: false,
      modalRiddle: '',
      modalTitle: '',
    };
    this.onClose = this.onClose.bind(this);
    this.onOpen = this.onOpen.bind(this);
  }

  toggleModal() {
    this.setState({ modalVisible: !this.state.modalVisible });
  }

  toggleRiddleBoard() {
    this.setState({ showRiddleBoard: !this.state.showRiddleBoard });
  }

  onOpen() {
    this.setState({ otherModalVisible: true });
  }

  onClose() {
    this.setState({ otherModalVisible: false });
  }

  componentDidMount() {
    Axios.get('http://ec2-3-17-167-48.us-east-2.compute.amazonaws.com/user/riddles?username=server').then(result => {
      this.setState({ riddleBoardRiddles: result.data });
    }).catch(err => {
      console.log(err);
    });
    Font.loadAsync({
      'treamd': require('./assets/fonts/Treamd.ttf'),
    }).then(res => {
      this.setState({ fontLoaded: true });
    });
  }

  render() {
    console.log(this.state);
    return (
      <ImageBackground style={style.backgroundImage} source={{ uri: 'https://imgur.com/LFmIDsn.jpg' }}>
        <View style={{ marginTop: 22 }}>
          <Modal
            animationType="slide"
            transparent={false}
            visible={this.state.modalVisible}
            onRequestClose={() => { Alert.alert('Modal has been closed.') }}
          >
            <ImageBackground style={style.backgroundImage} source={{ uri: 'https://imgur.com/LFmIDsn.jpg' }}>
              <View style={{ marginTop: 22 }}>
                <View>
                  <Text style={style.pirateText}>
                    {this.state.modalRiddle}
                  </Text>

                  <TouchableHighlight
                    onPress={() => {
                      this.toggleModal();
                    }}>
                    <Text>
                      Hide Riddle
                    </Text>
                  </TouchableHighlight>
                  <TouchableHighlight
                    onPress={() => {
                      this.toggleModal();
                      this.toggleRiddleBoard();
                    }}>
                    <Text>
                      See local riddles!
                    </Text>
                  </TouchableHighlight>
                </View>
              </View>
            </ImageBackground>
          </Modal>

          <Modal
            animationType="slide"
            transparent={false}
            visible={this.state.showRiddleBoard}
            onRequestClose={() => { Alert.alert('Modal has been closed.') }}
          >
            <ImageBackground style={style.backgroundImage} source={{ uri: 'https://imgur.com/LFmIDsn.jpg' }}>
              <View style={{ marginTop: 22 }}>
                <View>
                  {_.map(this.state.riddleBoardRiddles, riddle => {
                    return (<View>
                      <Text onPress={() => {
                        this.setState({ modalRiddle: riddle.riddle, modalTitle: riddle.title });
                        this.onOpen();
                      }} style={style.pirateText}>{riddle.title}</Text>
                    </View>);
                  })}
                  <TouchableHighlight
                    onPress={() => {
                      this.toggleRiddleBoard();
                    }}>
                    <Text>
                      Back to the map!
                    </Text>
                  </TouchableHighlight>
                </View>
              </View>
            </ImageBackground>
            <Overlay isVisible={this.state.otherModalVisible} closeOnTouchOutside onBackdropPress={this.onClose} overlayBackgroundColor={'rgba(52, 52, 52, 0.0)'}>
              <View style={{ height: '100%', width: '100%', backgroundColor: 'rgba(52, 52, 52, 0.8)', alignContent: 'center' }}>
                <ImageBackground style={style.otherBackground} source={{ uri: 'https://imgur.com/LFmIDsn.jpg' }}>
                  <ScrollView style={{ alignItems: 'center', justifyContent: 'center' }} overScrollMode='always'>
                    <Button style={{ paddingTop: 25 }} title={'Set Active Riddle'} onPress={() => { this.setState({ currentRiddle: this.state.modalRiddle }) }}></Button>
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                      <Text style={style.biggerPirateText}>{this.state.modalTitle}</Text>
                      <Text style={style.pirateText}>{this.state.modalRiddle}</Text>
                    </View>
                  </ScrollView>
                </ImageBackground>
              </View>
            </Overlay>
          </Modal>

          <TouchableHighlight
            onPress={() => {
              this.toggleModal();
            }}>
            <Text>View me riddle</Text>
          </TouchableHighlight>
        </View>
      </ImageBackground>
    );
  }
}

const style = StyleSheet.create({
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
