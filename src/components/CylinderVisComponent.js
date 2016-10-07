'use strict';

import React from 'react';
import React3 from 'react-three-renderer';
import THREE from 'three';

//import ReactNativeSlider from 'react-html5-slider';

require('styles//CylinderVis.css');

class CylinderVisComponent extends React.Component {
  constructor(props, context) {
    super(props, context);

    // construct the position vector here, because if we use 'new' within render,
    // React will think that things have changed when they have not.
    this.cameraPosition = new THREE.Vector3(0, 0, 5);

    this.state = {
      cubeRotation: new THREE.Euler()
    };

    this._onAnimate = () => {
      // we will get this callback every frame

      // pretend cubeRotation is immutable.
      // this helps with updates and pure rendering.
      // React will be sure that the rotation has now updated.
      this.setState({
        cubeRotation: new THREE.Euler(
          0.5,
          Math.PI/2,//this.state.cubeRotation.y + 0.00,
          0
        ),
        directionalLightPosition: new THREE.Vector3(1, 0, 0),
        scenePosition: new THREE.Vector3(0, 0, 0)
      });
    };
  }

  render() {
    const width = 500; // canvas width
    const height = 500; // canvas height

    return (
      <div className='cylindervis-component'>
        <React3
          mainCamera="camera" // this points to the perspectiveCamera which has the name set to "camera" below
          width={width}
          height={height}
          onAnimate={this._onAnimate}
        >
          <scene>
            <perspectiveCamera
              name="camera"
              fov={65}
              aspect={width / height}
              near={0.9}
              far={1000}

              position={this.cameraPosition}
            />
            <ambientLight
              color={0x404040}
            />
            <directionalLight
              color={0x404040}
              position={this.state.directionalLightPosition}
              lookAt={this.state.scenePosition}
            />
            <mesh
              rotation={this.state.cubeRotation}
            >
              <cylinderGeometry
                radiusTop={1}
                radiusBottom={1}
                height={2}
                radialSegments={100}
              />
              <meshPhongMaterial
                color={0x00ff00}
                transparent={true}
                opacity={.9}
                side={THREE.DoubleSide}
                wireframe={false}
              />
            </mesh>
          </scene>
        </React3>
        {/*<ReactNativeSlider
          value={this.state.currentValue}
          handleChange={this.changeValue}
          step={this.state.step}
          max={this.state.max}
          min={this.state.min}
          disabled='disabled' />*/}
      </div>
    );
  }
}

CylinderVisComponent.displayName = 'CylinderVisComponent';

// Uncomment properties you need
// CylinderVisComponent.propTypes = {};
// CylinderVisComponent.defaultProps = {};

export default CylinderVisComponent;
