'use strict';

import React from 'react';
import React3 from 'react-three-renderer';
import THREE from 'three';

import ReactNativeSlider from 'react-html5-slider';
import NumericInput from 'react-numeric-input';

require('styles//CylinderVis.less');

class CylinderVisComponent extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      cylinderRotation: new THREE.Euler(0.5, 0, 0),
      cylinderRadius: 1,
      cylinderHeight: 2,
      directionalLightPosition: new THREE.Vector3(1, 0, 0),
      scenePosition: new THREE.Vector3(0, 0, 0),
      cameraPosition: new THREE.Vector3(0, 0, 5)
    };

    /*this._onAnimate = () => {
      // we will get this callback every frame

      // pretend cylinderRotation is immutable.
      // this helps with updates and pure rendering.
      // React will be sure that the rotation has now updated.
      this.setState({
        cylinderRotation: new THREE.Euler(
          0.5,
          this.state.cylinderRotation.y + 0.01,
          0
        )
      });
    };*/
  }

  render() {
    const width = 500, // canvas width
          height = 500, // canvas height
          cylinderHeightMax = 3,
          cylinderRadiusMax = 2;

    return (
      <div className='cylindervis-component'>
        <React3
          mainCamera="camera" // this points to the perspectiveCamera which has the name set to "camera" below
          width={width}
          height={height}
          //onAnimate={this._onAnimate}
        >
          <scene>
            <perspectiveCamera
              name="camera"
              fov={65}
              aspect={width / height}
              near={0.9}
              far={1000}
              position={this.state.cameraPosition}
            />
            <ambientLight
              color={0x404040}
            />
            <directionalLight
              color={0x404040}
              position={this.state.directionalLightPosition}
              lookAt={this.state.scenePosition}
            />
            <mesh rotation={this.state.cylinderRotation}>
              <cylinderGeometry
                radiusTop={this.state.cylinderRadius}
                radiusBottom={this.state.cylinderRadius}
                height={this.state.cylinderHeight}
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

        <div className="controls">
          <div>
            <label htmlFor="cylinder-radius">Radius</label>
            <ReactNativeSlider
              value={this.state.cylinderRadius}
              handleChange={e => {
                this.setState({ cylinderRadius: Number(e.target.value) });
              }}
              step={0.01}
              max={cylinderRadiusMax}
              min={0}
              id="cylinder-radius"
              />
            <NumericInput
              value={this.state.cylinderRadius}
              onChange={valueAsNumber => {
                this.setState({ cylinderRadius: valueAsNumber });
              }}
              step={0.1}
              max={cylinderRadiusMax}
              min={0}
              precision={2} 
              />
          </div>

          <div>
            <label htmlFor="cylinder-radius">Height</label>
            <ReactNativeSlider
              value={this.state.cylinderHeight}
              handleChange={e => {
                this.setState({ cylinderHeight: Number(e.target.value) });
              }}
              step={0.01}
              max={cylinderHeightMax}
              min={0}
              />
            <NumericInput
              value={this.state.cylinderHeight}
              onChange={valueAsNumber => {
                this.setState({ cylinderHeight: valueAsNumber });
              }}
              step={0.1}
              max={cylinderHeightMax}
              min={0}
              precision={2} 
              />
          </div>
        </div>
      </div>
    );
  }
}

CylinderVisComponent.displayName = 'CylinderVisComponent';

// Uncomment properties you need
// CylinderVisComponent.propTypes = {};
// CylinderVisComponent.defaultProps = {};

export default CylinderVisComponent;
