import React, {Component} from 'react';
import {Modal, Text, TouchableHighlight, View, Alert} from 'react-native';

export default class RiddleModal extends Component {
  state = {
    modalVisible: false,
    showRiddleBoard: false,
  };

  toggleModal() {
    this.setState({modalVisible: !this.state.modalVisible});
  }

  toggleRiddleBoard() {
    this.setState({showRiddleBoard: !this.state.showRiddleBoard});
  }

  render() {
    return (
      <View style={{marginTop: 22}}>
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {Alert.alert('Modal has been closed.')}}
        >
          <View style={{marginTop: 22}}>
            <View>
              <Text>
                Starting at McHardy's Chicken & Fixin'
Head forward toward the corner of Broad Street and Bayou Road
Turn right at the corner of Broad Street and Bayou Road
Your destination is on the left.
Starting at Southern Rep Theatre
Head forward toward the corner of Broad Street and Bayou Road
Turn right at the corner of Broad Street and Bayou Road
Head forward and your destination is on the right.
Starting at Primary Eye Care
Head forward toward the corner of Broad Street and Columbus Street
Turn left at the corner of Broad Street and Columbus Street
Head forward and your destination is on the left.
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
        </Modal>
        
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.showRiddleBoard}
          onRequestClose={() => { Alert.alert('Modal has been closed.') }}
        >
          <View style={{ marginTop: 22 }}>
            <View>
              <Text>
                {this.props.riddles}
              </Text>
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
        </Modal>

        <TouchableHighlight
          onPress={() => {
            this.toggleModal();
          }}>
          <Text>View me riddle</Text>
        </TouchableHighlight>
      </View>
    );
  }
}