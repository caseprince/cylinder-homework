'use strict';

import React from 'react';

import ReactNativeSlider from 'react-html5-slider';

require('styles//CylinderVis.css');

class CylinderVisComponent extends React.Component {
  render() {
    return (
      <div className='cylindervis-component'>
        foo
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
