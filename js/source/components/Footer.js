import React, { Component } from 'react'; 
import Grid from 'react-bootstrap/lib/Grid';

import { subscribeToTimer, subscribeToDonorList, sendNewDonorId } from './SocketTimer';

import { navGeoPosition } from './geo';


class Footer extends Component {
  constructor(props) {
    super(props);

    subscribeToTimer((err, timestamp) => this.setState({ 
      timestamp, 
    }));

    subscribeToDonorList((err, idList) => { 

      console.log(idList);

      this.setState({ 
        idList, 
      })
    });

    sendNewDonorId('iD-XXXXX');

    navGeoPosition((err, lat, long) => this.setState({ 
      lat, long, 
    })); 

    this.state = {
      timestamp: 'no timestamp yet',
      lat: null,
      long:null,
      idList: 'no id listyet',

    };
  }

  render() {
    return (
      <Grid>
        <hr />
        <footer>
          <p>© Company 2014  - Time from server: {this.state.timestamp} | Lat: {this.state.lat} | Long: {this.state.long} | idList: {this.state.idList} </p>
        </footer>
      </Grid>
    );
  }
}

export default Footer
