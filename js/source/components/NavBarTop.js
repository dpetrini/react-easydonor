import React, { Component } from 'react';

// https://react-bootstrap.github.io/components.html
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap'

class NavBarTop extends Component {

  _onPanelClick (eventKey, e) {
    //console.log(' 0 ' + eventKey, e);
    //this.setState ({ popup: true });
  }

  _renderNavbar() {
    return (
      <div>
        <Navbar inverse={true} >
          <Navbar.Header>
            <Navbar.Brand>
              <LinkContainer to="/"><a href="#">Donor Easy - A system to support Blood Donation.</a></LinkContainer>
            </Navbar.Brand>
          </Navbar.Header>
          <Nav pullRight={true} onSelect={this._onPanelClick(this)}>
            <LinkContainer to="/about"><NavItem eventKey={2} href="#">About</NavItem></LinkContainer>
          </Nav>
        </Navbar> 
      </div>
    );
  }

  render() {
    return (
      <div>

        {this._renderNavbar()}

      </div>
    );
  }
}

export default NavBarTop
