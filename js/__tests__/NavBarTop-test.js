jest
  .dontMock('../source/components/NavBarTop')
;

import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-dom/test-utils';

const NavBarTop = require('../source/components/NavBarTop').default;

describe('Render NavBarTop components', () => {
  it('renders NavBarTop', () => {
    const button = TestUtils.renderIntoDocument(
      
      <NavBarTop />
      
    );

    //console.log(ReactDOM.findDOMNode(button).outerHTML);
    // console.log(ReactDOM.findDOMNode(button).children[0].nodeName);
    // console.log(ReactDOM.findDOMNode(button).children[0].children[0].nodeName);
    // console.log(ReactDOM.findDOMNode(button).children[0].children[0].className);
    // console.log(ReactDOM.findDOMNode(button).children[0].children[0].children[0].nodeName);
    // console.log(ReactDOM.findDOMNode(button).children[0].children[0].children[0].className);
 
    expect(ReactDOM.findDOMNode(button).children[0].nodeName).toEqual('DIV');

    const title = TestUtils.findRenderedDOMComponentWithClass(button, 'navbar-brand');

    expect(title.innerHTML).toBe('Donor Easy - A system to support Blood Donation by joining patients to donors.');

  });
   
});
