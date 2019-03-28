import Expo from 'expo';
import * as ExpoPixi from 'expo-pixi';
import React, { Component } from 'react';
import { Image, Button, Platform, AppState, StyleSheet, Text, View, Modal, TouchableHighlight } from 'react-native';
import HsvColorPicker from 'expo-hsv-color-picker';

const isAndroid = Platform.OS === 'android';
function uuidv4() {
  //https://stackoverflow.com/a/2117523/4047926
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export default class SketchFlag extends Component {
  state = {
    hue: 0,
    sat: 0,
    val: 1,
    image: null,
    strokeColor: Math.random() * 0xffffff,
    strokeWidth: Math.random() * 30 + 10,
    lines: [
      {
        points: [{ x: 300, y: 300 }, { x: 600, y: 300 }, { x: 450, y: 600 }, { x: 300, y: 300 }],
        color: 0xff00ff,
        alpha: 1,
        width: 10,
      },
    ],
    appState: AppState.currentState,
    modalVisible: false,
  };

  handleAppStateChangeAsync = nextAppState => {
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      if (isAndroid && this.sketch) {
        this.setState({ appState: nextAppState, id: uuidv4(), lines: this.sketch.lines });
        return;
      }
    }
    this.setState({ appState: nextAppState });
  };

  componentDidMount() {
    AppState.addEventListener('change', this.handleAppStateChangeAsync);
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleAppStateChangeAsync);
  }

  onChangeAsync = async () => {
    const { uri } = await this.sketch.takeSnapshotAsync();

    this.setState({
      image: { uri },
      strokeWidth: Math.random() * 30 + 10,
      strokeColor: Math.random() * 0xffffff,
    });
  };

  onReady = () => {
    console.log('ready!');
  };

  onSatValPickerChange({ saturation, value }) {
    this.setState({
      sat: saturation,
      val: value,
    });
  }

  onHuePickerChange({ hue }) {
    this.setState({
      hue,
    });
  }

  toggleModal() {
    this.setState({
      modalVisible: !this.state.modalVisible
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.container}>
          <View style={styles.sketchContainer}>
            <ExpoPixi.Sketch
              ref={ref => (this.sketch = ref)}
              style={styles.sketch}
              strokeColor={this.state.strokeColor}
              strokeWidth={this.state.strokeWidth}
              strokeAlpha={1}
              onChange={this.onChangeAsync}
              onReady={this.onReady}
              initialLines={this.state.lines}
            />
            <View style={styles.label}>
              <Text>Canvas - draw here</Text>
            </View>
          </View>
          <View style={styles.imageContainer}>
            <View style={styles.label}>
              <Text>Snapshot</Text>
            </View>
            <Image style={styles.image} source={this.state.image} />
          </View>
        </View>
        <Button
          color={'blue'}
          title="undo"
          style={styles.button}
          onPress={() => {
            this.sketch.undo();
          }}
        />
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
          }}>
          <View style={{ marginTop: 22 }}>
            <View>
              <HsvColorPicker
                huePickerHue={this.state.hue}
                onHuePickerDragMove={this.onHuePickerChange.bind(this)}
                onHuePickerPress={this.onHuePickerChange.bind(this)}
                satValPickerHue={this.state.hue}
                satValPickerSaturation={this.state.sat}
                satValPickerValue={this.state.val}
                onSatValPickerDragMove={this.onSatValPickerChange.bind(this)}
                onSatValPickerPress={this.onSatValPickerChange.bind(this)}
              />
              <TouchableHighlight
                onPress={() => {
                  this.toggleModal();
                }}>
                <Text>Hide Modal</Text>
              </TouchableHighlight>
            </View>
          </View>
        </Modal>

        <TouchableHighlight
          onPress={() => {
            this.toggleModal();
          }}>
          <Text>Show Modal</Text>
        </TouchableHighlight>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sketch: {
    flex: 1,
  },
  sketchContainer: {
    height: '50%',
  },
  image: {
    flex: 1,
  },
  imageContainer: {
    height: '50%',
    borderTopWidth: 4,
    borderTopColor: '#E44262',
  },
  label: {
    width: '100%',
    padding: 5,
    alignItems: 'center',
  },
  button: {
    // position: 'absolute',
    // bottom: 8,
    // left: 8,
    zIndex: 1,
    padding: 12,
    minWidth: 56,
    minHeight: 48,
  },
});