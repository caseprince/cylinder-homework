'use strict';

import React from 'react';
import React3 from 'react-three-renderer';
import THREE from 'three';
import classNames from 'classnames';
import ReactNativeSlider from 'react-html5-slider';
import NumericInput from 'react-numeric-input';

require('styles//CylinderVis.less');

export default class CylinderVisComponent extends React.Component {
  
  static displayName = 'CylinderVisComponent';

  constructor(props, context) {
    super(props, context);

    this.pointLightPosition = new THREE.Vector3(10, 10, 10);
    this.scenePosition = new THREE.Vector3(0, 0, 0);
    this.cameraPosition = new THREE.Vector3(0, 2, 5);
    this.cylinderSegments = 64;

    this.state = {
      cylinderRadius: 1,
      cylinderHeight: 2,
      pointX: 0,
      pointY: 0,
      pointZ: 0,
      linePosition: new THREE.Vector3(0, 0, 0),
      lineDirection: new THREE.Vector3(1, 0, 0),
      lineLength: 1,
      distance: 1,
      usePerspCamera: true,
      ringRotation: new THREE.Euler(Math.PI/-2, 0, 0),
      ringPosition: new THREE.Vector3(0, 0, 0)
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
          mainCamera={this.state.usePerspCamera ?
                      'cameraPersp' : 'cameraOrtho'}
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
              position={this.cameraPosition}
              lookAt={this.scenePosition}
            />
            <orthographicCamera
              name="cameraOrtho"
              top={orthoZoom}
              right={orthoZoom}
              bottom={-orthoZoom}
              left={-orthoZoom}
              near={0.9}
              far={1000}
              position={this.cameraPosition}
              lookAt={this.scenePosition}
            />
            <ambientLight color={0x404040}/>
            <pointLight position={this.pointLightPosition}/>
            <mesh>
              <cylinderGeometry
                radiusTop={this.state.cylinderRadius}
                radiusBottom={this.state.cylinderRadius}
                height={this.state.cylinderHeight}
                radialSegments={this.cylinderSegments}
              />
              <meshLambertMaterial
                color={0x00ffDC}
                transparent={true}
                opacity={.7}
                side={THREE.BackSide}
                wireframe={false}
              />
            </mesh>
            <mesh rotation={this.state.ringRotation}
                  position={this.state.ringPosition}>
              {/* TODO: replace ringGeometry with shapeGeometry when implemented?:
                  https://github.com/toxicFork/react-three-renderer/wiki/Internal-Components
                  */}
              <ringGeometry
                innerRadius={this.state.cylinderRadius - 0.02}
                outerRadius={this.state.cylinderRadius}
                thetaSegments={this.cylinderSegments}
                phiSegments={this.cylinderSegments}
              />
              <lineBasicMaterial
                color={0xffff00}
                linewidth={2}
              />
            </mesh>

            <mesh position={this.state.linePosition}>
              <octahedronGeometry
                radius={0.06}
                detail={0}
              />
              <lineBasicMaterial
                color={0xffff00}
                linewidth={2}
              />
            </mesh>
            <mesh>
              <cylinderGeometry
                radiusTop={this.state.cylinderRadius}
                radiusBottom={this.state.cylinderRadius}
                height={this.state.cylinderHeight}
                radialSegments={this.cylinderSegments}
              />
              <meshLambertMaterial
                color={0x00ffDC}
                transparent={true}
                opacity={.4}
                side={THREE.FrontSide}
                wireframe={false}
              />
            </mesh>
            <arrowHelper
              dir={this.state.lineDirection}
              origin={this.state.linePosition}
              length={this.state.lineLength}
              headLength={0.2}
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
            Starting Point Coordinates:
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
            label="z"
            max={pointCoordMax}
            min={-pointCoordMax}
            value={this.state.pointZ}
            onChange={val => this.update('pointZ', val) }
          />

          <hr/>

          <h2>Distance to Surface:</h2>
          <div className={classNames('output', {negative: this.state.distance < 0})}>
            {this.state.distance}
          </div>

          <hr/>

          <h2>Camera:</h2>
          <button
            type="button"
            className="camera-toggle"
            onClick={() => {
              this.setState({
                usePerspCamera: !this.state.usePerspCamera
              });
            }}
          >
            {`Use ${this.state.usePerspCamera ? 'Orthographic' : 'Perspective'} Camera`}
          </button>

          <hr/>
          
          <h2>Source:</h2>
          <a href="https://github.com/caseprince/cylinder-homework">
            https://github.com/caseprince/cylinder-homework
          </a>
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
    newState.distance = dist;
    newState.lineLength = Math.abs(dist);
    newState.lineDirection = dir;

    let ringY = Math.max(Math.min(pointY, this.state.cylinderHeight/2), this.state.cylinderHeight/-2);
    newState.ringPosition = new THREE.Vector3( 0, ringY, 0);

    this.setState(newState);
  }

  toCylinderSurface(radius, height, x, y, z) {
    let fromOrigin = Math.sqrt((z * z) + (x * x)),
        dist = radius - fromOrigin,
        dir = new THREE.Vector3(1, 0, 0);

    // Order of directional preference when equal distances: Sideways (positive x), Up, Down
    if (dist < 0 && (y > height / 2 || y < height /-2)) {
      // Outside cylinder radius && above or below endcaps
      let yDif = y > 0 ? y - height / 2 : y - height / -2;
      dist = Math.sqrt((dist * dist) + (yDif * yDif));
      dir = new THREE.Vector3(x * (1/dist), yDif * (1/dist),  z * (1/dist));
      dist *= -1;
    } else if (y >= 0 && dist > (height / 2) - y) {
      // Closest to top endcap
      dir = new THREE.Vector3(0, 1, 0);
      dist = (height / 2) - y;
    } else if (y < 0 && dist > (height / 2) + y) {
      // Closest to bottom endcap
      dir = new THREE.Vector3(0, -1, 0);
      dist = (height / 2) + y;
    } else if (fromOrigin > 0) {
      // All other coords not centered on y axis
      dir = new THREE.Vector3(x * (1/fromOrigin), 0,  z * (1/fromOrigin));
    }

    // TODO: Fixed precision OR arbitrary precision decimals?
    // big.js, decimal.js, or bignumber.js?
    dist = Number(dist.toPrecision(12));

    if (dist < 0) {
      // THREE.ArrowHelper doesn't like negative lengths, so we invert the direction vector.
      dir.negate();
    }
    
    return {dist, dir}
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
