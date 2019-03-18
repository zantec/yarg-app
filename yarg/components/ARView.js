import React from 'react';
import { AR, Asset } from 'expo';
// Let's alias ExpoTHREE.AR as ThreeAR so it doesn't collide with Expo.AR.
import ExpoTHREE, { AR as ThreeAR, THREE } from 'expo-three';
// Let's also import `expo-graphics`
// expo-graphics manages the setup/teardown of the gl context/ar session, creates a frame-loop, and observes size/orientation changes.
// it also provides debug information with `isArCameraStateEnabled`
import { View as GraphicsView } from 'expo-graphics';

import TouchableView from '../components/TouchableView';

export default class ARView extends React.Component {
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
      this.scene.remove(object);
      object.position.set(point.x, point.y, point.z);
    }
  };
  
  componentDidMount() {
    // Turn off extra warnings
    THREE.suppressExpoWarnings(true)
    ThreeAR.suppressWarnings()
  }

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
          isArRunningStateEnabled
          isArCameraStateEnabled
          arTrackingConfiguration={AR.TrackingConfiguration.World}
        />
      </TouchableView>
    );
  }

  onTouchesBegan = async ({ locationX: x, locationY: y }) => {
    if (!this.renderer) {
      return;
    }

    const size = this.renderer.getSize();
    console.log('touch', { x, y, ...size });

    //const position = ThreeAR.improviseHitTest({x, y}); <- Good for general purpose: "I want a point, I don't care how"
    const { hitTest } = await AR.performHitTest(
      {
        x: x / size.width,
        y: y / size.height,
      },
      AR.HitTestResultTypes.HorizontalPlane
    );

    for (let hit of hitTest) {
      const { worldTransform } = hit;
      if (this.cube) {
        this.scene.remove(this.cube);
      }

      const geometry = new THREE.BoxGeometry(0.0254, 0.0254, 0.0254);
      const material = new THREE.MeshBasicMaterial({
        color: 0x00ff00,
      });
      this.cube = new THREE.Mesh(geometry, material);
      this.scene.add(this.cube);

      this.cube.matrixAutoUpdate = false;

      const matrix = new THREE.Matrix4();
      matrix.fromArray(worldTransform);

      this.cube.applyMatrix(matrix);
      this.cube.updateMatrix();
    }
  };

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
    this.sprite.position.z = -1
    this.scene.add(this.sprite);

    // Setup a light so we can see the cube color
    // AmbientLight colors all things in the scene equally.
    this.scene.add(new THREE.AmbientLight(0xffffff));

    // Create this cool utility function that let's us see all the raw data points.
    this.points = new ThreeAR.Points();
    // Add the points to our scene...
    this.scene.add(this.points)
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
    // This will make the points get more rawDataPoints from Expo.AR
    this.points.update()
    // Finally render the scene with the AR Camera
    this.renderer.render(this.scene, this.camera);
  };
}