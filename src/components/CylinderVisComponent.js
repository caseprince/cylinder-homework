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
      directionalLightPosition: new THREE.Vector3(1, 0.5, 0),
      scenePosition: new THREE.Vector3(0, 0, 0),
      cameraPosition: new THREE.Vector3(0, 0, 5),
      pointX: 0,
      pointY: 0,
      pointZ: 0
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
          cylinderRadiusMax = 2,
          pointCoordMax = 4;

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
              <meshLambertMaterial
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
          <h2>
            Cylinder Geometry:
          </h2>
          <SliderInput 
            id="point-x"
            label="Radius"
            value={this.state.cylinderRadius}
            min={0}
            max={cylinderRadiusMax}
            onChange={val => this.setState({ cylinderRadius: val }) }
            />
          <SliderInput 
            id="point-x"
            label="Radius"
            value={this.state.cylinderHeight}
            min={0}
            max={cylinderHeightMax}
            onChange={val => this.setState({ cylinderHeight: val }) }
            />

          <hr/>

          <h2>
            Point Coords:
          </h2>
          <SliderInput 
            id="point-x"
            label="X"
            max={pointCoordMax}
            min={-pointCoordMax}
            value={this.state.pointX}
            onChange={val => this.setState({ pointX: val }) }
            />
          <SliderInput 
            id="point-y"
            label="Y"
            max={pointCoordMax}
            min={-pointCoordMax}
            value={this.state.pointY}
            onChange={val => this.setState({ pointY: val }) }
            />
          <SliderInput 
            id="point-z"
            label="Z"
            max={pointCoordMax}
            min={-pointCoordMax}
            value={this.state.pointZ}
            onChange={val => this.setState({ pointZ: val }) }
            />
         

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


class SliderInput extends React.Component {
  render() {
    return (
      <div>
        <label htmlFor={this.props.id}>{this.props.label}</label>
        <ReactNativeSlider
          value={this.props.value}
          handleChange={e => this.props.onChange(Number(e.target.value)) }
          step={0.01}
          max={this.props.max}
          min={this.props.min}
          id={this.props.id}
          />
        <NumericInput
          value={this.props.value}
          onChange={val => this.props.onChange(val) }
          step={0.1}
          max={this.props.max}
          min={this.props.min}
          precision={2}
          />
      </div>
    );
  }
}
