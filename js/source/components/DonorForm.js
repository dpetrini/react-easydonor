import React, { Component } from 'react'; 
import PropTypes from 'prop-types'
import { FormGroup, SplitButton, MenuItem, FormControl, Button, Col, ControlLabel, Form } from 'react-bootstrap';

import { sendNewDonorId } from './SocketTimer';
import { getIp } from './ip';

class DonorForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      firstName: null,   
      bloodGroup: 'BloodGroup', 
      messageValidation: 'Please Enter Your Information',
      lat: props.latitude,
      long: props.longitude,
    };

    this.myIp = null; 

    // Get Ip
    getIp((err, ip) => {
      if (err) {
        console.log(err, 'error, leaving', ip)
        return;
      }
      // service provided an ip
      this.myIp = ip;   
    }); 

  }

  _onSubmit(e) {
    e.preventDefault();

    // Check if fields are validated
    if (this.state.emailValid != 'success' || this.state.phoneValid != 'success') {
      this.setState({
        messageValidation: 'Please fill correctly',
      });
      return;
    }

    // Check if blood type is selected
    if (this.state.bloodGroup.match(/BloodGroup/g)) {
      this.setState({
        messageValidation: 'Please Select Blood Type',
      });
      return;
    } 

    // From here on will submit

    const deviceData	= {
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      contactNumber: this.state.contactNumber,
      emailAddress: this.state.emailAddress,
      bloodGroup: this.state.bloodGroup,
      lat: this.state.lat,
      long: this.state.long,
      location:{
        coordinates:[
          this.state.long,
          this.state.lat],
        type:'Point',
      },
      ip: this.myIp,
    };
    console.log(deviceData)

    // Send data to server
    fetch('http://127.0.0.1:3000/donors', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(deviceData), // this.state
    })
      .then(response => response.json())
      .then(result => {
        console.log(JSON.stringify(result));
        
        // Notify server (and other by server's broadcast)
        sendNewDonorId(result._id);

        // Notify parent - as broadcast don´t comeback
        this.fireOnresultDataChange(result._id);

      })
      .catch((error) => {
        console.error(error);
      });
    
    // Will insert message of deletion/edition address: 
    this.setState({
      messageValidation: 'Success! Please close to return',
    });
    
  }

  // Send information about new point to parent
  fireOnresultDataChange(id) {
    this.props.onDataChange(id);
  }

  // Expects "success","warning","error",null
  _emailValidate(e) {
    const value = e.target.value; 

    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (re.test(value)) {
      this.setState({
        emailValid: 'success',
        emailAddress: e.target.value,
      });
    } else {
      this.setState({emailValid: 'error'});
    }
  }

  _phoneValidate(e) {
    const value = e.target.value; 

    // +XX XXX XXXX XXXX | 00XX XXX XXXX XXXX 
    // original: /^\+?([0-9]{2})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{4})$/;
    const re = /^\+?([0-9]{2})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})[-. ]?([0-9]{4})$/;
    const re2 = /^(\+?|[0]{2})([0-9]{2})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})[-. ]?([0-9]{4})$/;

    if (re.test(value) || re2.test(value)) {
      this.setState({
        phoneValid: 'success',
        contactNumber: e.target.value,
      });
    } else {
      this.setState({phoneValid: 'error'});
    }
  }

  _inputChange(fieldName, e) {

    this.setState({
      [fieldName]: e.target.value,
    });
  }

  // Select for Blood Type
  _selectChange(eventKey, e) {

    let blood;

    switch (parseInt(eventKey, 10)) {
      case 1:
        blood = 'O-'
        break;
      case 2:
        blood = 'O+'
        break;   
      case 3:
        blood = 'A-'
        break;
      case 4:
        blood = 'A+'
        break;
      case 5:
        blood = 'B-'
        break;
      case 6:
        blood = 'B+'
        break;   
      case 7:
        blood = 'AB-'
        break;
      case 8:
        blood = 'AB+'
        break;           
    }

    this.setState({
      bloodGroup: blood,
    });
  }

  // Input group - all have same call back on Blur
  _eachTextInput(name, text, required, onChange, validation) {
    return (
      <FormGroup validationState={validation}>

        <Col componentClass={ControlLabel} sm={3}>
          {name}
        </Col>
        <Col sm={9}>
          <FormControl className="text-left" type="text" 
            name={name} 
            required={required}
            placeholder={text} 
            onChange={onChange}/>
          <FormControl.Feedback />                 
        </Col>

      </FormGroup>

    );
  }


  render() {
    return (
      <div>
        <Form horizontal={true} onSubmit={this._onSubmit.bind(this)} action="">
          {this._eachTextInput('First Name', 'your first name', true, this._inputChange.bind(this, 'firstName'), null)}
          {this._eachTextInput('Last Name', 'your last name', false, this._inputChange.bind(this, 'lastName'), null)}
          {this._eachTextInput('Contact Number', 'your contact number', true, this._phoneValidate.bind(this), this.state.phoneValid)}
          {this._eachTextInput('Email', 'your email here', true, this._emailValidate.bind(this) , this.state.emailValid)}
          
          <FormGroup>
            <Col componentClass={ControlLabel} sm={3}>
                Blood Group
            </Col>
            <Col sm={9}>
              <SplitButton title={this.state.bloodGroup} 
                required={true} 
                pullRight={true} 
                id="split-button-pull-right"  
                onSelect={this._selectChange.bind(this)}
              >
                <MenuItem eventKey="1">O-</MenuItem>
                <MenuItem eventKey="2">O+</MenuItem>
                <MenuItem eventKey="3">A+</MenuItem>
                <MenuItem eventKey="4">A-</MenuItem>
                <MenuItem eventKey="5">B-</MenuItem>
                <MenuItem eventKey="6">B+</MenuItem>
                <MenuItem eventKey="7">AB+</MenuItem>
                <MenuItem eventKey="8">AB-</MenuItem>
              </SplitButton>
            </Col>
          </FormGroup>

          <FormGroup>
            <Col componentClass={ControlLabel} sm={9} smOffset={1}>
              <p className="text-left" style={{color: 'red'}}> {this.state.messageValidation}</p>
            </Col>
            <Col sm={2}>
              <Button type="submit">
                Submit
              </Button>
            </Col>
          </FormGroup>

        </Form>
     
      </div>
    );
  }
}

DonorForm.propTypes = {
  latitude: PropTypes.number,
  longitude: PropTypes.number,
  onDataChange: PropTypes.func,
};

export default DonorForm

