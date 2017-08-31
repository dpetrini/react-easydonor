import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-bootstrap';

export default class About extends Component {
  render() {
    return (
      <Grid>
        <Row>
          <Col md={12}>
            <div>
              <h1>
          About
              </h1>
              <h4> 
          The application consists of client and server.
          The server is express/nodejs and this client is react.
                <br /><br />
                <strong>Dear evaluator</strong>, this version was upgraded comparing to delivered version, some missing requirements were integrated, as follows:
                <br /><br />
                <ul>
                  <li> Get IP and send to server along with donor data </li>
                  <li> This About screen (React Router) </li>
                  <li> Full control of map: drag and load included, remove default UI buttons </li>
                  <li> Link for Donor Updata/Delete information (express form) </li>  
                  <li> Jest tests for NavBarTOP and DonorForm Components </li>
                </ul>
          Some still missing requirements:
                <ul>
                  <li> Lazy load: use mongodb geospatial. </li>
                  <li> Finish Jest for other components </li>
                  <li> Some UI updates related to React life Cycle </li>
                </ul>
                <br />
                If you wish you can check original code by "grunt watch" after "npm install" in delivered client code, or please contact me.
                <br /><br />
                <strong>General Usage:</strong>
                <br />          
          This app is for blood donors and patients.
                <br />
          Donors can click on map and insert its contact information. It will create mark (red ball) and patients will be able to see in map and contact if needed.
                <br />
          Patients can look in the map, close to their places and click on red ball to retrieve donor contact info.
              </h4>
            </div>
          </Col>
        </Row>
      </Grid>
    );
  }
}
