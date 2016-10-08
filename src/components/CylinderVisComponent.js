'use strict';

import React from 'react';
import React3 from 'react-three-renderer';
import THREE from 'three';

import ReactNativeSlider from 'react-html5-slider';
import NumericInput from 'react-numeric-input';

require('styles//CylinderVis.less');

export default class CylinderVisComponent extends React.Component {
  
  static displayName: 'CylinderVisComponent';

  constructor(props, context) {
    super(props, context);

    this.state = {
      cylinderRotation: new THREE.Euler(0, 5, 0),
      cylinderRadius: 1,
      cylinderHeight: 2,
      pointLightPosition: new THREE.Vector3(10, 10, 10),
      scenePosition: new THREE.Vector3(0, 0, 0),
      cameraPosition: new THREE.Vector3(0, 2, 5),
      pointX: 0,
      pointY: 0,
      pointZ: 0,
      linePosition: new THREE.Vector3(0, 0, 0),
      lineDirection: new THREE.Vector3(1, 0, 0),
      lineLength: 1,
      lineArrowLength: 0.2
    };
  }

  render() {
    const width = 500, // canvas width
          height = 500, // canvas height
          orthoZoom = 2.5,
          cylinderHeightMax = 4,
          cylinderRadiusMax = 2,
          pointCoordMax = 2;

    return (
      <div className='cylindervis-component'>
        <React3
          mainCamera="cameraPersp"
          width={width}
          height={height}
          antialias={true}
        >
          <scene>
            <perspectiveCamera
              name="cameraPersp"
              fov={65}
              aspect={width / height}
              near={0.9}
              far={1000}
              position={this.state.cameraPosition}
              lookAt={this.state.scenePosition}
            />
            <orthographicCamera
              name="cameraOrtho"
              top={orthoZoom}
              right={orthoZoom}
              bottom={-orthoZoom}
              left={-orthoZoom}
              near={0.9}
              far={1000}
              position={this.state.cameraPosition}
            />
            <ambientLight
              color={0x404040}
            />
            <pointLight
             position={this.state.pointLightPosition}
             />
            <mesh rotation={this.state.cylinderRotation}>
              <cylinderGeometry
                radiusTop={this.state.cylinderRadius}
                radiusBottom={this.state.cylinderRadius}
                height={this.state.cylinderHeight}
                radialSegments={100}
              />
              <meshPhongMaterial
                color={0x00ffDC}
                transparent={true}
                opacity={.6}
                side={THREE.DoubleSide}
                wireframe={false}
              />
            </mesh>
            <arrowHelper
              dir={this.state.lineDirection}
              origin={this.state.linePosition}
              //rotation={this.state.cylinderRotation}
              length={this.state.lineLength}
              headLength={this.state.lineArrowLength}
              headWidth={0.1}
            />
          </scene>
        </React3>

        <div className="controls">
          <h2>
            Cylinder Geometry:
          </h2>
          <SliderInput
            id="cylinder-radius"
            label="radius"
            value={this.state.cylinderRadius}
            min={0}
            max={cylinderRadiusMax}
            onChange={val => this.update('cylinderRadius', val)}
            />
          <SliderInput
            id="cylinder-height"
            label="height"
            value={this.state.cylinderHeight}
            min={0}
            max={cylinderHeightMax}
            onChange={val => this.update('cylinderHeight', val) }
            />

          <hr/>

          <h2>
            Point Coords:
          </h2>
          <SliderInput
            id="point-x"
            label="x"
            max={pointCoordMax}
            min={-pointCoordMax}
            value={this.state.pointX}
            onChange={val => this.update('pointX', val) }
            />
          <SliderInput
            id="point-y"
            label="y"
            max={pointCoordMax}
            min={-pointCoordMax}
            value={this.state.pointY}
            onChange={val => this.update('pointY', val) }
            />
          <SliderInput
            id="point-z"
            label="x"
            max={pointCoordMax}
            min={-pointCoordMax}
            value={this.state.pointZ}
            onChange={val => this.update('pointZ', val) }
            />

          <hr/>
          <p>
            {`Distance to Surface: ${this.state.lineLength}`}
          </p>

        </div>
      </div>
    );
  }

  update(prop, val) {
    let newState = this.state;
    newState[prop] = val;
    let { pointX, pointY, pointZ } = newState;
    newState.linePosition = new THREE.Vector3( pointX, pointY, pointZ );
    let { dist, dir } = this.toCylinderSurface(
                          this.state.cylinderRadius,
                          this.state.cylinderHeight,
                          pointX,
                          pointY,
                          pointZ
                        );
    newState.lineLength = dist;
    newState.lineArrowLength = dist < 0 ? -0.2 : 0.2;
    newState.lineDirection = dir;
    this.setState(newState);
  }

  toCylinderSurface(radius, height, x, y, z) {
    let fromOrigin = Math.sqrt((z * z) + (x * x)),
        dist = radius - fromOrigin,
        dir;
      if (fromOrigin === 0) {
        if (height / 2 < radius) {
           dir = new THREE.Vector3( 0, 1, 0 );
           dist = height / 2;
        } else {
           dir = new THREE.Vector3( 1, 0, 0 );
           dist = radius;
        }
      } else if (y >= 0 && dist > (height / 2) - y ) {
        dir = new THREE.Vector3( 0, 1, 0 );
        dist = (height / 2) - y;
      } else if (y < 0 && dist > (height / 2) + y ) {
        dir = new THREE.Vector3( 0, -1, 0 );
        dist = (height / 2) + y;
      } else {
        dir = new THREE.Vector3( x * (1/fromOrigin), 0,  z * (1/fromOrigin));
      }
    
    return { dist, dir }
  }
}


class SliderInput extends React.Component {

  static propTypes = {
    id: React.PropTypes.string.isRequired,
    label: React.PropTypes.string.isRequired,
    value: React.PropTypes.number.isRequired,
    max: React.PropTypes.number.isRequired,
    min: React.PropTypes.number.isRequired,
    onChange: React.PropTypes.func.isRequired
  };

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
