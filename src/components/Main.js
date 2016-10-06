require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';

import CylinderVisComponent from './CylinderVisComponent';

class AppComponent extends React.Component {
  render() {
    return <CylinderVisComponent />;
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
