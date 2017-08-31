/*
TODO
-(OK) Soh enviar campos corretos para o server (db)
-Testes com JEST - ok para NavBarTOP e DonorForm.
-Remover dependenciasdos componentes principais para testar isoladamente (MainMap, Footer)
-(OK) Link para atualização do Donor (router-nao, sim criar form no express) 
-(OK) Tela about (router)
-(OK) Get IP and send to server along with donor data
-(OK) Controlar drag e tirar UI da tela
-Check lazy update: with geospatial find with mongodb, with a radius

*/


import React, { Component } from 'react';
import { Map, Layers, Graphic, Geometry, Symbols,Widgets } from 'react-arcgis';
import { Popover, Modal, Button } from 'react-bootstrap';

import DonorForm from './DonorForm';

import { subscribeToDonorList } from './SocketTimer';

const SearchWidget = Widgets.Search;

let donorList = [];

const serverName = 'http://127.0.0.1:3000/donors/form/';

class MainMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      myViewProperties: {
        scale: 50000,
        center: [props.long, props.lat],
      },
      dragging: false,
      dragPrevious: null,
      closestDonor: {
        firstName: null,
        lastName: null,
        contactNumber: null,
        emailAddress: null,
        bloodGroup: null,
        lat: null,
        long: null,
      },
      originalCenter: [props.long, props.lat],
      donorList: [],
      popup: false,
      popover: false,
      donorInfoPopup: false,
      pointDistance: Infinity,
      requirePointsUpdate: true,
      minIndex: null,
      donorInfoEditPopup: false,
      newId: null,
      
    };

    this.requirePointsUpdateNew = true;

    // data points don´t need to be state -- keeps data from server
    this.data = [];

    // socket io
    // Subscribe to receive notifications when there is a new 
    //  donor to display
    subscribeToDonorList((err, idList) => { 

      console.log(idList);

      this.fetchNewId(this.data, idList);
    });

    //this.handleViewPropertyChange = this.handleViewPropertyChange.bind(this);
    this.goto = this.goto.bind(this);

    // Initial Fetch from server - Donor Points.
    //this.fetchDataFromServer(this.data);

    console.log("contructor")

  } // End constructor

  // Close main popup handler
  _onCloseDonorFormPopup() {
    this.setState ({ popup: false });
  }

  // Close click-on-red-point Popup (to see Donor info on Map)
  _onCloseDonorInfoPopup() {
    this.setState ({ 
      donorInfoPopup: false,
      popover: false,
    });
  }

  // Close popup that shows URL to edit data on server
  _onCloseDonorInfoEditPopup() {
    this.setState ({ 
      donorInfoEditPopup: false,
    });
  }

  // Click on Map Handle - opens different popups accordingly
  //
  //  Checks the DISTANCE to check if within certain range (0.5 cm for instance - to Red Point)
  //   opens the Donor Information popup 
  //  If not inside the point opens the New Donor Popup
  //
  onClickMap(e) {

    // check the closest donor and update state inside to prepare for Patient Popup
    this.checkMatchPoint(e.mapPoint.latitude, e.mapPoint.longitude);

    // Update center property to center map
    const newViewProperties = this.state.myViewProperties
    newViewProperties.center = [e.mapPoint.longitude, e.mapPoint.latitude];

    // setState of myViewProperties: newViewProperties bellow
    
    /* 
      IMPORTANT: Threshould for placement around 0.5 cm in map
                  considering scale.
    */
    let limit = parseFloat(this.state.myViewProperties.scale) / 200000;
    //console.log("Limit: " + limit, this.state.myViewProperties.scale);

    if (this.state.pointDistance < limit) {
    
      // Opens the Client popup
      this.setState ({ 
        donorInfoPopup: true,
        myViewProperties: newViewProperties,
      });

    } else {

      // Opens the Donor register popup
      this.setState ({ 
        popup: true,
        myViewProperties: newViewProperties,
      });

    }
  }

  // Enables rendering popover to display the email and phone number
  _onClickDonorInfo() {

    if (this.state.popover === false)
      this.setState ({ popover: true });
    else
      this.setState ({ popover: false });
  }

  // Change from Donor Form popup (submit new Donor)
  // Retrieve new id and force UI updates
  // Closes form popup
  // Opens info Edit popup
  _onDonorFormDataChange(id) {

    this.fetchNewId(this.data, id);
    this.setState({
      donorInfoEditPopup: true,
      newId: id,
      popup: false,
    });
  }

  // Renders donor popup to show to patients
  // inside it a popover will show the detail info
  _renderDonorInfoPopup() {

    if (this.state.donorInfoPopup == true) {

      return (
        <Modal.Dialog style={{top: '145px', right: '450px'}} 
          bsSize="small" 
          aria-labelledby="contained-modal-title-sm"
        >
          <Modal.Header>
            <Modal.Title id="contained-modal-title-sm"> 
              Closest Donor: {this.state.closestDonor.firstName} {this.state.closestDonor.lastName}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h4>Blood Type: {this.state.closestDonor.bloodGroup}</h4>
            { this.state.popover
              ? 
              <div style={{ height: 20, width: 300 }}>
                <Popover style={{ width: 280 }}
                  id="popover-basic"
                  placement="right"
                  positionLeft={325}
                  positionTop={10}
                  title="Contact:"
                >
                  <strong>Phone:</strong> {this.state.closestDonor.contactNumber} 
                  <br />
                  <strong>Email:</strong> {this.state.closestDonor.emailAddress}
                </Popover>
              </div>

              :null }

            <Button onClick={this._onClickDonorInfo.bind(this)}>Click for Detail info</Button>

          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this._onCloseDonorInfoPopup.bind(this)}>Close</Button>
          </Modal.Footer>
        </Modal.Dialog>
      );

    } else 
      return null;
  }


  // Renders donor edit/delete popup info
  _renderDonorInfoEditPopup() {

    if (this.state.donorInfoEditPopup === true) {
      return (
        <Modal.Dialog>
          <Modal.Header>
            <Modal.Title> 
              Take note of this address to edit or delete your data!
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {serverName}{this.state.newId}
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this._onCloseDonorInfoEditPopup.bind(this)}>Close</Button>
          </Modal.Footer>
        </Modal.Dialog>
      );

    } else 
      return null;
  }

  // Render popup to display Donor input form
  _renderDonorFormPopup() {

    if (this.state.popup === true) {
      return (
        <div className="static-modal">
          <Modal.Dialog>
            <Modal.Header>
              <Modal.Title>
                  New Donor Input @
                  ({this.state.myViewProperties.center[1].toFixed(2)}, 
                {this.state.myViewProperties.center[0].toFixed(2)}). 
                  We kindly appreciate!
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <DonorForm 
                latitude={this.state.myViewProperties.center[1]} 
                longitude={this.state.myViewProperties.center[0]} 
                onDataChange={this._onDonorFormDataChange.bind(this)}
              />
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={this._onCloseDonorFormPopup.bind(this)} >Close</Button>
            </Modal.Footer>
          </Modal.Dialog>
        </div>
      );

    } else 
      return null;

  }


  // Main render function for Map component. Renders the main Map and popups
  render() {
  
    return (
      <div>
        <Map
          onClick={this.onClickMap.bind(this)}
          onMouseWheel={this.handleMouseWheel.bind(this)}
          onDrag={this.handleDrag.bind(this)}
          onLoad={this.handleMapLoad.bind(this)}
          mapProperties={{ basemap: 'streets' }}
          dataFlow="oneWay"
          style={{ width: '80vw', height: '80vh' }}
          viewProperties={this.state.myViewProperties}
          onViewPropertyChange={this.handleViewPropertyChange.bind(this)}
        >
          <Layers.GraphicsLayer>
            {this.state.donorList}      
          </Layers.GraphicsLayer> 

          <SearchWidget position="top-right" />      
        </Map>

        <button onClick={() => this.goto(this.state.originalCenter[0],this.state.originalCenter[1])}>
          Back to My Place
        </button>

        {this._renderDonorFormPopup()}

        {this._renderDonorInfoPopup()}

        {this._renderDonorInfoEditPopup()}

      </div>
    );
  }

  // Fetch new ID when is notified by socket or after new point inserted here
  fetchNewId(data, id) {

    let url = 'http://127.0.0.1:3000/donors/' + id;

    console.log(url);

    //Executa Ajax 
    fetch(url)
      .then(response => response.json())
      .then(result => {

        console.log(result);

        if (result.firstName !== undefined && result.lat !== undefined)
          data.push ({
            firstName: result.firstName,
            lastName: result.lastName,
            contactNumber: result.contactNumber,
            emailAddress: result.emailAddress,
            bloodGroup: result.bloodGroup,
            lat: result.lat,
            long: result.long,
          });

        console.log(data);

        // Just force a state update to make new point appear
        this.requirePointsUpdateNew = true; // force not state variable too
        this.setState({
          requirePointsUpdate: true,
        });

      })
      .catch((error) => {
        console.error(error);
      })

      
  }

  // Retrieve Donors from server
  fetchDataFromServer(data) {

    data.splice(0, data.length);

    //Execute Ajax 
    fetch('http://127.0.0.1:3000/donors')
      .then(response => response.json())
      .then(result => {

        result.forEach(function(element, index) {
          if (element.firstName !== undefined && element.lat !== undefined)
            data.push ({
              firstName: element.firstName,
              lastName: element.lastName,
              contactNumber: element.contactNumber,
              emailAddress: element.emailAddress,
              bloodGroup: element.bloodGroup,
              lat: element.lat,
              long: element.long,
            });

          // insert in initial Data to diplay POINTS at first time.
          // addDonorPoint(initData, element.long, element.lat);
         
          
        }, this);

        console.log("Fim fetch: " + data.length)

        //callback();
        //this.placeDonors()
        // console.log(donorList)
        //console.log(this.state.donorList)
        // Just force a state update to make new point appear
        //this.requirePointsUpdateNew = true; // force not state variable too
        // this.setState({
        //   requirePointsUpdate: true,
        // });
        
      })
      .catch((error) => {
        console.error(error);
      })
      

  }

  handleViewPropertyChange(key, value) {
    console.log("Prop. Change" + key,value)
    const newViewProperties = this.state.myViewProperties
    newViewProperties[key] = value;

    this.setState({
      myViewProperties: newViewProperties,
    });
  }

  //  GoTo coordinate. Useful for buttons
  goto(latitude, longitude) {
    const newViewProperties = this.state.myViewProperties

    newViewProperties.center = [latitude, longitude];
    this.setState({
      myViewProperties: newViewProperties,
    });
    
  }

  // Handle load to remove UI buttons. So map is "controlled"
  handleMapLoad(map, view) {
    view.ui.remove('compass');
    view.ui.remove('zoom');
    view.ui.remove('navigation-toggle');
    this.setState({
      myMap: map,
      myView: view,
    });
  }

  // Handle mousewheel as a controlled event
  handleMouseWheel(e) {
    e.stopPropagation();

    const newViewProperties = this.state.myViewProperties;
    newViewProperties.scale = newViewProperties.scale + (e.deltaY * (newViewProperties.scale / 250));

    this.setState({
      myViewProperties: newViewProperties,
    });

    // To require points placement in new view
    this.requirePointsUpdateNew = true;

  }

  // Handle drag as a controlled event
  handleDrag(e) {
    e.stopPropagation();

    const newViewProperties = this.state.myViewProperties;

    if (e.action === 'start') {
      this.setState({
        dragPrevious: {
          x: e.x,
          y: e.y,
        },
        dragging: true, 
      });
 
    } else if (e.action === 'end') {
      this.setState({
        dragPrevious: null,
        dragging: false,
      });
    } else if (e.action === 'update' && this.state.dragging) {
      newViewProperties.center = [
        newViewProperties.center[0] - 0.0001 * (e.x - this.state.dragPrevious.x) * (newViewProperties.scale / 25000),
        newViewProperties.center[1] + 0.0001 * (e.y - this.state.dragPrevious.y) * (newViewProperties.scale / 25000),
      ];
      this.setState({
        dragPrevious: {
          x: e.x,
          y: e.y,
        },
        myViewProperties: newViewProperties,
      });
    }
    // To require points placement in new view
    this.requirePointsUpdateNew = true;
  }

  //
  // LIFE CYCLE hooks
  // 
  // 

  componentWillUnmount() {
    console.log("Unmount")
  }

  componentDidMount() {

    console.log("Mount")

    // Initial Fetch from server - Donor Points.
    this.fetchDataFromServer(this.data);
    //this.placeDonors();

    // Ao contrario que se fala, nao funciona abaixo.
    // Acho que o problema é o react-argcis, pois ele que
    //  quebra com os updates aqui.
    // IT may be a bug in component: test isolated and report.
    // this.setState({
    //   requirePointsUpdate: true,
    // });
  }

  componentDidUpdate() {

  }

  // takes care of updating the list of points on screen, mainly for Lazy load
  componentWillUpdate () {

    // Update list of points
    if (this.data.length && this.requirePointsUpdateNew === true) {
      //this.placeDonorsLazy();  //--> Not so stable now
      //this.fetchDataFromServer(this.data);
      this.placeDonors(); 
      console.log(this.requirePointsUpdateNew)

      this.requirePointsUpdateNew = false; // Not using this.state to avoid multiple updates
    }
    console.log(".")
  }

  // Place the donor points on map
  placeDonors() {

    console.log("PD: " + this.data.length)

    donorList.splice(0, donorList.length);

    this.data.forEach(function(element, index) {
      addDonorPoint(donorList, element.long, element.lat);
    });

    this.setState({
      donorList: donorList,
    });

  }

  // Lazy Place the donor points on map
  // check for map scale and define a radius or selection
  // in this case we select a 12cm radius from center of screen
  //
  // This lazy load is not perfect but good
  //
  // Points of improvement:
  // -instead splicing donorlist, push or pop accoording to changes
  // -check square instead of radius
  //
  // Use Mongo db geospatial: 
  //  https://docs.mongodb.com/manual/tutorial/geospatial-tutorial/
  //
  placeDonorsLazy() {
   
    let startTime, endTime, timeDiff;

    let tempDistance;
    let latitude = this.state.myViewProperties.center[1];
    let longitude = this.state.myViewProperties.center[0];

    // re - start donorList
    donorList.splice(0, donorList.length);

    let limit = parseFloat(this.state.myViewProperties.scale) / 8000;

    //console.log("Lazy Limit: " + limit, this.state.myViewProperties.scale);

    startTime = new Date();
    
    // Not using forEach for performance reasons
    for (let i = 0; i < this.data.length; i++) {

      tempDistance = this.distance(latitude, longitude, this.data[i].lat, this.data[i].long);

      if (tempDistance < limit) {
        addDonorPoint(donorList, this.data[i].long, this.data[i].lat);
        //console.log("Lazy, dist, long, lat", tempDistance, this.data[i].long, this.data[i].lat, this.data[i].firstName);
      }

    }
    endTime = new Date();
    timeDiff = endTime - startTime; //in ms

    //console.log('Size Donor List: ' + donorList.length + ' Tam fetch: ' + this.data.length + ' Limit: ' + limit + ' Elapsed: ' + timeDiff);

    this.setState({
      donorList: donorList,
    });

  }

  // Finds the closest Donor to fill popup for Patient
  checkMatchPoint(latitude, longitude) {

    let closestDonor = {};

    let temp = 0,
      min = Infinity, 
      minIndex = 0;

    for (let i = 0; i < this.data.length; i++) {

      temp = this.distance(latitude, longitude, this.data[i].lat, this.data[i].long);

      if (temp < min) {
        min = temp;
        minIndex = i;
      }

    }

    closestDonor = {
      firstName: this.data[minIndex].firstName,
      lastName: this.data[minIndex].lastName,
      contactNumber: this.data[minIndex].contactNumber,
      emailAddress: this.data[minIndex].emailAddress,
      bloodGroup: this.data[minIndex].bloodGroup,
      lat: this.data[minIndex].lat,
      long: this.data[minIndex].lat,
    };

    //console.log(closestDonor);

    this.setState({
      minIndex: minIndex,
      pointDistance: min,
      closestDonor: closestDonor,

    });

    return minIndex; // Not in use now

  }

  // using faster calculation from(Haversine formula) 
  // Distance in kilometers
  // https://stackoverflow.com/questions/27928/calculate-distance-between-two-
  //   latitude-longitude-points-haversine-formula
  distance(lat1, lon1, lat2, lon2) {
    var p = 0.017453292519943295; // Math.PI / 180
    var c = Math.cos;
    var a = 0.5 - c((lat2 - lat1) * p)/2 + 
          c(lat1 * p) * c(lat2 * p) * 
          (1 - c((lon2 - lon1) * p))/2;

    return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
  }
}

export default MainMap



/* 
  Add new donor position mark in map
  -check need for componentWillUpdate
  -Use Map class above or create new class
*/
function addDonorPoint (array, long, lat) {

  let length = array.length;

  array.push(
    //<Layers.GraphicsLayer key={length++}>
    <Graphic key={length++}>
      <Symbols.SimpleMarkerSymbol
        symbolProperties={{
          color: [226, 119, 40],
          outline: {
            color: [255, 255, 255],
            width: 2,
          },
        }}
      />
      <Geometry.Point
        geometryProperties={{
          latitude: lat,
          longitude: long,
        }}
      />    
    </Graphic>
    //</Layers.GraphicsLayer>
  );

}
