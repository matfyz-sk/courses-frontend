import React, { Component } from 'react';
import {
Navbar,
NavbarBrand,
NavLink,
NavItem,
Dropdown,
DropdownMenu,
DropdownItem,
DropdownToggle,
Nav,
UncontrolledDropdown,
} from 'reactstrap';
export default class PageHeader extends Component{

  render(){
    return(
      <Navbar color="light" light expand="md">
        <UncontrolledDropdown>
          <DropdownToggle>
            <NavbarBrand onClick={()=>this.props.history.push('/')}>Webdesign</NavbarBrand>
          </DropdownToggle>
          <DropdownMenu>
            Webdesign
          </DropdownMenu>
        </UncontrolledDropdown>

        <Nav navbar>
          <NavItem>
            <NavLink href="/info/">Info</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="/lectures/">Lectures</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="/labs/">Labs</NavLink>
          </NavItem>
          <NavItem>
            <NavLink onClick={()=>this.props.history.push('/assignments')} >Assignments</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="/results/">Results</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="/quiz/">Quiz</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="/files/">Files</NavLink>
          </NavItem>
        </Nav>
          <Nav className="ml-auto" navbar>
            <NavItem>
              <NavLink href="/notifications/">Notifications</NavLink>
            </NavItem>
            <UncontrolledDropdown nav inNavbar>
              <DropdownToggle nav caret>
                Options
              </DropdownToggle>
              <DropdownMenu right>
                <DropdownItem>
                  Account settings
                </DropdownItem>
                <DropdownItem divider />
                <DropdownItem>
                  Log out
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </Nav>
      </Navbar>

    )
  }
}
