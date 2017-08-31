jest
  .dontMock('../source/components/DonorForm')
;

import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-dom/test-utils';

const DonorForm = require('../source/components/DonorForm').default;

// <DonorForm 
//   latitude={this.state.myViewProperties.center[1]} 
//   longitude={this.state.myViewProperties.center[0]} 
//   onDataChange={this._onDonorFormDataChange.bind(this)}/>
// />

describe('Render Donor Form component', () => {
  it('renders all elements from Form', () => {
    const myComponent = TestUtils.renderIntoDocument(
      <DonorForm />
    );
  
    //console.log(ReactDOM.findDOMNode(myComponent).outerHTML);

    expect(ReactDOM.findDOMNode(myComponent).children[0].nodeName).toEqual('FORM');

    const inputs = TestUtils.scryRenderedDOMComponentsWithTag(myComponent, 'input');
    expect(inputs[0].name).toBe('First Name');
    expect(inputs[1].name).toBe('Last Name');
    expect(inputs[2].name).toBe('Contact Number');
    expect(inputs[3].name).toBe('Email');

    const titleButton = TestUtils.scryRenderedDOMComponentsWithTag(myComponent, 'button');
    //  console.log(titleButton.length); //3
    expect(titleButton[0].innerHTML).toBe('BloodGroup');
    expect(titleButton[2].innerHTML).toBe('Submit');//2

  });
});

describe('Check input values for Donor Form component', () => {

  it('Checks wrong input validation', () => {
    const callback = jest.genMockFunction();
    const myComponent = TestUtils.renderIntoDocument(
      <DonorForm 
        latitude={-23.6500} 
        longitude={-89.0001} 
        onDataChange={callback}
      />
    );
    // console.log(ReactDOM.findDOMNode(myComponent).outerHTML);

    // Checks the message to user
    let title = TestUtils.findRenderedDOMComponentWithTag(myComponent, 'P');
    expect(title.textContent).toBe(' Please Enter Your Information');

    // Recover the inputs 
    const inputs = TestUtils.scryRenderedDOMComponentsWithTag(myComponent, 'input');
    
    // Recover the submit button
    const submitButton = TestUtils.scryRenderedDOMComponentsWithTag(myComponent, 'button');
    expect(submitButton[2].innerHTML).toBe('Submit');

    // values for input values
    TestUtils.Simulate.change(inputs[0], { target: { value: '' } });
    TestUtils.Simulate.change(inputs[1], { target: { value: '' } });
    TestUtils.Simulate.change(inputs[2], { target: { value: '' } });
    TestUtils.Simulate.change(inputs[3], { target: { value: '' } });

    // SImulate the submit 
    let form = TestUtils.findRenderedDOMComponentWithTag(myComponent, 'form');
    TestUtils.Simulate.submit(form);

    // Checks the user message text out out, should be different
    title = TestUtils.findRenderedDOMComponentWithTag(myComponent, 'P');
    expect(title.textContent).toBe(' Please fill correctly');

  });

  it('Checks missing bloodtype input validation', () => {
    const callback = jest.genMockFunction();
    const myComponent = TestUtils.renderIntoDocument(
      <DonorForm 
        latitude={-23.6500} 
        longitude={-89.0001} 
        onDataChange={callback}
      />
    );
    // console.log(ReactDOM.findDOMNode(myComponent).outerHTML);

    // Checks the message to user
    let title = TestUtils.findRenderedDOMComponentWithTag(myComponent, 'P');
    expect(title.textContent).toBe(' Please Enter Your Information');

    // Recover the inputs 
    const inputs = TestUtils.scryRenderedDOMComponentsWithTag(myComponent, 'input');

    // values for input values
    TestUtils.Simulate.change(inputs[0], { target: { value: 'A Fist name' } });
    TestUtils.Simulate.change(inputs[1], { target: { value: 'A Last name' } });
    TestUtils.Simulate.change(inputs[2], { target: { value: '+55 111 9999 8888' } });
    TestUtils.Simulate.change(inputs[3], { target: { value: 'ddd@gmail.com' } });

    // SImulate the submit 
    let form = TestUtils.findRenderedDOMComponentWithTag(myComponent, 'form');
    TestUtils.Simulate.submit(form);

    // Checks the user message text out out, should be different
    title = TestUtils.findRenderedDOMComponentWithTag(myComponent, 'P');
    expect(title.textContent).toBe(' Please Select Blood Type');

  });



  it('Check with proper inputs including DropDown selection', () => {
    const callback = jest.genMockFunction();
    const myComponent = TestUtils.renderIntoDocument(
      <DonorForm 
        latitude={-23.6500} 
        longitude={-89.0001} 
        onDataChange={callback}
      />
    );

      // TestUtils.Simulate.submit(form).simulate('submit', { preventDefault: jest.fn() });

    // Check form Submit, how to handle Fetch?? -> não vamos submeter para DB

  });
  
});
