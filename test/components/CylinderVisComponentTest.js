/* eslint-env node, mocha */
/* global expect */
/* eslint no-console: 0 */
'use strict';

// Uncomment the following lines to use the react test utilities
// import TestUtils from 'react-addons-test-utils';
import createComponent from 'helpers/shallowRenderHelper';

import CylinderVisComponent from 'components//CylinderVisComponent.js';

describe('CylinderVisComponent', () => {
  let component,
      instance;

  beforeEach(() => {
    component = createComponent(CylinderVisComponent);
    instance = new CylinderVisComponent();
  });

  it('should have its component name as default className', () => {
    expect(component.props.className).to.equal('cylindervis-component');
  });

  it('should calculate distances correctly', () => {
    expect(instance.toCylinderSurface(1, 2, 0, 0, 0).dist).to.equal(1);
    expect(instance.toCylinderSurface(1, 2, 0, 0.58, 0).dist).to.equal(0.42);
    expect(instance.toCylinderSurface(1.5, 2, 0.5, 0, 0.5).dist).to.equal(0.792893218813);
    expect(instance.toCylinderSurface(0.82, 2.26, 0.82, 1.56, 1.35).dist).to.equal(-0.87279928849);
  });
});
