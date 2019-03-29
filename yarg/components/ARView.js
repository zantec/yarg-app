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
    this.claimTreasureUpdateGold = this.claimTreasureUpdateGold.bind(this);
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
        treasureDistances.push({
          distance: this.haversineDistance(this.props.userCoords, treasure[0]), 
          treasureID: treasure[1], 
          goldAmount: treasure[2]
        });
      });
      treasureDistances.sort((a, b) => a.distance - b.distance);
      this.setState({ treasureDistances });
      treasureDistances[0].distance < .04 ? this.setState({ renderX: true }) : this.setState({ renderX: false });
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
        riddleDistances.push({
          distance: this.haversineDistance(this.props.userCoords, riddle[0]), 
          riddleID: riddle[1]
        });
      });
      riddleDistances.sort((a, b) => a.distance - b.distance);
      this.setState({ riddleDistances });
      riddleDistances[0].distance < .04 ? this.setState({ renderRiddle: true }) : this.setState({ renderRiddle: false });
    }
    console.log(this.state);
  }

  // ##Enable and handle touch## //
  touch = new THREE.Vector3();
  raycaster = new THREE.Raycaster();

  updateTouch = ({ x, y }) => {
    const { width, height } = this.scene.size;
    this.touch.x = x / width * 2 - 1;
    this.touch.y = -(y / height) * 2 + 1;
    // this.touch.z = -1 / Math.tan(22.5 * Math.PI / 180);
    this.runHitTest();
  };

  runHitTest = () => {
    this.raycaster.setFromCamera(this.touch, this.camera);
    const intersects = this.raycaster.intersectObjects(this.scene.children, true);
    for (const intersect of intersects) {
      const { distance, face, faceIndex, object, point, uv } = intersect;
      //pass in the tapped object (the X) to function that will handle removing
      //it and updating database values for user gold/treasure & transactions
      if (object.name === 'theSpot') {
        this.claimTreasureUpdateGold();
      } else {
        console.log('riddle tapped!')
        this.addRiddleToInventory();
      }
    }
  };

  claimTreasureUpdateGold() {
    let treasCoords = this.state.treasureCoords;
    const closestX = this.state.treasureDistances[0];
    treasCoords.forEach((treasure, i) => {
      if (treasure[1] === closestX.treasureID) {
        treasCoords.splice(i, 1);
        this.setState({
          treasureCoords: treasCoords
        })
      }
    });
    
    // send patch request containing username and amount of gold to insert
    axios.patch('http://ec2-3-17-167-48.us-east-2.compute.amazonaws.com/user/gold', {
      username: 'ryan',
      amount: closestX.goldAmount
    })
      .then((res) => {
        this.setState({ renderX: false });
        // update the current gold amount
        this.props.getGold();
      })
      .catch(err => console.error(err))
    
    // Vibration.vibrate();
  }

  addRiddleToInventory = () => {
    let riddCoords = this.state.riddleCoords;
    const closestRiddle = this.state.riddleDistances[0];
 

    axios.post(`http://${process.env.SERVER_API}/user/inventory`, {
      id_user: 13,
      id_riddle: closestRiddle.riddleID
    })
      .then((res) => {
        this.setState({ renderRiddle: false });
        riddCoords.forEach((riddle, i) => {
          if (riddle[1] === closestRiddle.riddleID) {
            riddCoords.splice(i, 1);
            this.setState({
              riddleCoords: riddCoords
            })
          }
        });
      })
      .catch(err => console.error(err))
  }

  //Get distance between user and treasure or riddles
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
    this.sprite.position.x = -5;
    this.sprite.position.z = -5;
    this.sprite.position.y = -10;

    // Load 3D object file for riddles
    this.riddleObj = await ExpoTHREE.loadObjAsync({ 
      asset: require('../assets/3D/scroll/14059_Pirate_Treasure_map_Scroll_v1_L1.obj'),
      mtlAsset: require('../assets/3D/scroll/14059_Pirate_Treasure_map_Scroll_v1_L1.mtl'),
      onAssetRequested: {
        '14059PirateTreasuremapScroll_diffuse.jpg': require('../assets/3D/scroll/14059PirateTreasuremapScroll_diffuse.jpg')
      }
    });

    // create a subscene to add to our main scene. later we'll add the scroll obj to it 
    // and use the subscene to detect raycast intersections so we know if the scroll is 'tapped'
    this.scene2 = new THREE.Scene();
    this.scene.add(this.scene2);

    // this.riddleObj.scale.set(1, 1, 1);
    // this.riddleObj.position.x = -5;
    // this.riddleObj.position.z = -20;
    // this.riddleObj.position.y = -10;
    ExpoTHREE.utils.scaleLongestSideToSize(this.riddleObj, 5);
    ExpoTHREE.utils.alignMesh(this.riddleObj, {x: 10, y: -1, z: -20 });
    
    
    // SpotLight illuminates elements in a cone shape from a point
    // this.spotLight = new THREE.SpotLight(0xffffff);
    // this.spotLight.position.set(100, 1000, 100);
    // this.spotLight.castShadow = true;
    // this.spotLight.shadow.mapSize.width = 1024;
    // this.spotLight.shadow.mapSize.height = 1024;
    // this.spotLight.shadow.camera.near = 500;
    // this.spotLight.shadow.camera.far = 4000;
    // this.spotLight.shadow.camera.fov = 30;
    // this.scene.add(this.spotLight);
    // this.scene.add(new THREE.SpotLight(0xffffff));

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
    // add the 'X' sprite to the scene if renderX is true, otherwise remove it
    if (this.state.renderX) {
      this.sprite.name = 'theSpot';
      this.scene.add(this.sprite);
    } else if (this.state.renderX === false) {
      this.scene.remove(this.scene.getObjectByName('theSpot'));
      }
    // add the subscene containing the scroll to the scene if renderRiddle is true, otherwise remove it
    if (this.state.renderRiddle) {
      this.riddleObj.name = 'riddleScroll';
      this.scene2.add(this.riddleObj);

      // this.scene.add(this.riddleObj);
    } else if (this.state.renderRiddle === false) {
      this.scene2.remove(this.scene2.getObjectByName('riddleScroll'));
    }

    // add rotation animation to the scroll
    this.riddleObj.rotation.y += Math.PI / 180
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