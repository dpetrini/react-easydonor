import React, { Component } from 'react';

// https://react-bootstrap.github.io/components.html
import { Grid, Row, Col } from 'react-bootstrap';

import MainMap from './MainMap';

import { navGeoPosition } from './geo';

// Send props coordinates
var Coords = {
  lat: -23.54,
  long: -46.59,
};

class Body extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lat: 1,
      long: 1,
    }

    // Read user coordinates from BROWSER
    navGeoPosition((err, lat, long) => {

      // User didn´t provided or browser didn´t allow
      if (err) {
        console.log('error, leaving', lat, long)
        return;
      }

      // User provided a coordinate
      Coords.lat = lat;
      Coords.long = long;
    
    }); 
  }

  componentWillMount () {

    if (this.state.lat != Coords.lat)

      this.setState({
        lat: Coords.lat,
        long: Coords.long,
      }); 

  }

  render() {
    return (
      <div>
        <Grid>
          <Row>
            <Col md={12}>
              <MainMap lat={this.state.lat} long={this.state.long}/>
            </Col>
          </Row>
        </Grid> 
      </div>
    );
  }
}

export default Body
