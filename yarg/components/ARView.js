import React from 'react';
import { AR, Asset, Constants } from 'expo';
// Let's alias ExpoTHREE.AR as ThreeAR so it doesn't collide with Expo.AR.
import ExpoTHREE, { AR as ThreeAR, THREE } from 'expo-three';
// Let's also import `expo-graphics`
// expo-graphics manages the setup/teardown of the gl context/ar session, creates a frame-loop, and observes size/orientation changes.
// it also provides debug information with `isArCameraStateEnabled`
import { View as GraphicsView } from 'expo-graphics';
import { Vibration } from 'react-native';
import axios from 'axios';
import _ from 'lodash'

import TouchableView from '../components/TouchableView';

export default class ARView extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      treasureCoords: null,
      treasureDistances: null,
      riddleCoords: null,
      riddleDistances: null,
      renderX: false,
      renderRiddle: false,
    }
  }

  componentDidMount() {
    // Turn off extra warnings
    THREE.suppressExpoWarnings(true);
    ThreeAR.suppressWarnings();
  }

  componentDidUpdate(prevProps) {

    if (this.state.treasureCoords === null) {
      let treasureCoords = [];
      this.props.treasures.forEach(treasure => treasureCoords.push(
        [[treasure.location_data.longitude, treasure.location_data.latitude], treasure.id, treasure.gold_value]
      ));
      this.setState({ treasureCoords });
    } else if (this.state.treasureCoords.length && this.props.userCoords !== prevProps.userCoords) {
      let treasureDistances = [];
      this.state.treasureCoords.forEach(treasure => {
        treasureDistances.push([this.haversineDistance(this.props.userCoords, treasure[0]), treasure[1], treasure[2]]);
      });
      treasureDistances.sort((a, b) => a[0] - b[0]);
      this.setState({ treasureDistances });
      treasureDistances[0][0] < .003 ? this.setState({ renderX: true }) : this.setState({ renderX: false });
    }
    
    if (this.state.riddleCoords === null) {
      let riddleCoords = [];
      this.props.riddles.forEach(riddle => riddleCoords.push(
        [[riddle.location_data.longitude, riddle.location_data.latitude], riddle.id]
      ));
      this.setState({ riddleCoords });
    } else if (this.state.riddleCoords.length && this.props.userCoords !== prevProps.userCoords) {
      let riddleDistances = [];
      this.state.riddleCoords.forEach(riddle => {
        riddleDistances.push([this.haversineDistance(this.props.userCoords, riddle[0]), riddle[1]]);
      });
      riddleDistances.sort((a, b) => a[0] - b[0]);
      this.setState({ riddleDistances });
      riddleDistances[0][0] < .003 ? this.setState({ renderRiddle: true }) : this.setState({ renderRiddle: false });
    }
    console.log(this.state);
  }

  // ##Enable and handle touch## //
  touch = new THREE.Vector2();
  raycaster = new THREE.Raycaster();

  updateTouch = ({ x, y }) => {
    const { width, height } = this.scene.size;
    this.touch.x = x / width * 2 - 1;
    this.touch.y = -(y / height) * 2 + 1;

    this.runHitTest();
  };

  runHitTest = () => {
    this.raycaster.setFromCamera(this.touch, this.camera);
    const intersects = this.raycaster.intersectObjects(this.scene.children);
    for (const intersect of intersects) {
      const { distance, face, faceIndex, object, point, uv } = intersect;
      //pass in the tapped object (the X) to function that will handle removing
      //it and updating database values for user gold/treasure & transactions
      this.claimTreasureUpdateGold(object);
    }
  };

  claimTreasureUpdateGold = (tappedX) => {
    //remove X sprite from the scene
    this.scene.remove(tappedX);
    //send patch request containing username and amount of gold to insert
    axios.patch(`http://${process.env.SERVER_API}/user/gold`, {
      username: 'acreed1998',
      amount: 1000
    })
      .then(res => console.log(JSON.stringify(res)))
      .catch(err => console.error(err))
    //updates the current gold amount
    this.props.getGold();
    Vibration.vibrate();
  }

  // ##Get distance between user and extant treasures## //
  haversineDistance = (coords1, coords2, isMiles) => {
    function toRad(x) {
      return x * Math.PI / 180;
    }

    const lon1 = coords1[0];
    const lat1 = coords1[1];

    const lon2 = coords2[0];
    const lat2 = coords2[1];

    const R = 6371; // km

    const x1 = lat2 - lat1;
    const dLat = toRad(x1);
    const x2 = lon2 - lon1;
    const dLon = toRad(x2)
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;

    if (isMiles) d /= 1.60934;

    return d;
  }


  // When our context is built we can start coding 3D things.
  onContextCreate = async ({ gl, scale: pixelRatio, width, height }) => {
    // This will allow ARKit to collect Horizontal surfaces
    AR.setPlaneDetection('horizontal');

    // Create a 3D renderer
    this.renderer = new ExpoTHREE.Renderer({
      gl,
      pixelRatio,
      width,
      height,
    });

    // We will add all of our meshes to this scene.
    this.scene = new THREE.Scene();

    this.scene.size = { width, height };
    // This will create a camera texture and use it as the background for our scene
    this.scene.background = new ThreeAR.BackgroundTexture(this.renderer);
    // Now we make a camera that matches the device orientation. 
    // Ex: When we look down this camera will rotate to look down too!
    this.camera = new ThreeAR.Camera(width, height, 0.01, 1000);


    // Create a sprite from X.png and add it to the scene
    const spriteMap = await ExpoTHREE.loadTextureAsync({ asset: require('./res/x.png') })
    const spriteMaterial = new THREE.SpriteMaterial({ map: spriteMap, color: '#fff' });
    this.sprite = new THREE.Sprite(spriteMaterial);
    this.sprite.scale.set(1, 1, 1);
    this.sprite.position.x = -10;
    this.sprite.position.z = -5;
    this.sprite.position.y = -10;

    // Load 3D object file for riddles
    const riddleObj = await ExpoTHREE.loadObjAsync({ 
      asset: require('../assets/3D/scroll/14059_Pirate_Treasure_map_Scroll_v1_L1.obj'),
      mtlAsset: require('../assets/3D/scroll/14059_Pirate_Treasure_map_Scroll_v1_L1.mtl'),
      onAssetRequested: {
        '14059PirateTreasuremapScroll_diffuse.jpg': require('../assets/3D/scroll/14059PirateTreasuremapScroll_diffuse.jpg')
      }
    });

    // const riddle = {
    //   'obj': require('../assets/3D/scroll/14059_Pirate_Treasure_map_Scroll_v1_L1.obj'),
    //   'mtl': require('../assets/3D/scroll/14059_Pirate_Treasure_map_Scroll_v1_L1.mtl'),
    //   // 'jpg': require('../assets/3D/scroll/14059PirateTreasuremapScroll_diffuse.jpg'),
    // };

    // /// Load chest!
    // const assetProvider = (name) => {
    //   return riddle[name];
    // };
    // const riddleObj = await ExpoTHREE.loadAsync(
    //   [riddle['obj'], riddle['mtl']],
    //   null,
    //   assetProvider,
    // );


    // this.riddleMesh = new THREE.Mesh(riddleObj, riddleTexture);
    // this.riddleObj.scale.set(1, 1, 1);
    // this.riddleObj.position.x = -10;
    // this.riddleObj.position.z = -5;
    // this.riddleObj.position.y = -10;
    ExpoTHREE.utils.scaleLongestSideToSize(riddleObj, 5);
    ExpoTHREE.utils.alignMesh(riddleObj, {x: -2, y: -1, z: -4 });
    
    this.scene.add(riddleObj);
    

    // AmbientLight colors all things in the scene equally.
    this.scene.add(new THREE.AmbientLight(0xffffff));

    // Create this cool utility function that let's us see all the raw data points.
    this.points = new ThreeAR.Points();
    // // Add the points to our scene...
    // this.scene.add(this.points)
  };

  // When the phone rotates, or the view changes size, this method will be called.
  onResize = ({ x, y, scale, width, height }) => {
    // Let's stop the function if we haven't setup our scene yet
    if (!this.renderer) {
      return;
    }
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setPixelRatio(scale);
    this.renderer.setSize(width, height);
  };

  // Called every frame.
  onRender = () => {
    if (this.state.renderX) {
      this.sprite.name = 'theSpot';
      this.scene.add(this.sprite);
    } else if (this.state.renderX === false) {
      this.scene.remove(this.scene.getObjectByName('theSpot'));
        // this.scene.traverse(function (object) {
        //   if (object instanceof THREE.Sprite) {
        //     this.scene.remove(object);
        //   }
        // });
      }
    // This will make the points get more rawDataPoints from Expo.AR
    this.points.update()
    // Finally render the scene with the AR Camera
    this.renderer.render(this.scene, this.camera);
  };

  render() {
    // You need to add the `isArEnabled` & `arTrackingConfiguration` props.
    // `isArRunningStateEnabled` Will show us the play/pause button in the corner.
    // `isArCameraStateEnabled` Will render the camera tracking information on the screen.
    // `arTrackingConfiguration` denotes which camera the AR Session will use. 
    // World for rear, Face for front (iPhone X only)
    return (
      <TouchableView
        style={{ flex: 1 }}
        onTouchesBegan={({ locationX, locationY }) =>
          this.updateTouch({ x: locationX, y: locationY })}
        onTouchesMoved={({ locationX, locationY }) =>
          this.updateTouch({ x: locationX, y: locationY })}
      >
        <GraphicsView
          style={{ flex: 1 }}
          onContextCreate={this.onContextCreate}
          onRender={this.onRender}
          onResize={this.onResize}
          isArEnabled
          isArCameraStateEnabled
          arTrackingConfiguration={AR.TrackingConfiguration.World}
        />
      </TouchableView>
    );
  }
}