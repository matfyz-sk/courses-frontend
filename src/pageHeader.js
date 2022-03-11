import React, { Component } from "react";
import {
  Collapse,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Nav,
  Navbar,
  NavbarBrand,
  NavbarToggler,
  NavItem,
  NavLink,
  UncontrolledDropdown
} from "reactstrap";
import { NavLink as NV } from "react-router-dom";
import { connect } from "react-redux";
import { setUserAdmin } from "./redux/actions";

class PageHeader extends Component {
  state = {
    isOpen: false
  };

  toggle = () => {
    this.setState({
      isOpen: !this.state.isOpen
    });
  };

  render() {
    return (
      <Navbar color="light" light expand="md">
        <UncontrolledDropdown>
          <DropdownToggle>
            <NavbarBrand href="/">Webdesign</NavbarBrand>
          </DropdownToggle>
          <DropdownMenu>
            Webdesign
          </DropdownMenu>
        </UncontrolledDropdown>
        <NavbarToggler onClick={ this.toggle }/>
        <Collapse isOpen={ this.state.isOpen } navbar>
          <Nav navbar>
            <NavItem>
              <NavLink tag={ NV } to="/info">
                Info
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink tag={ NV } to="/lectures">
                Lectures
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink tag={ NV } to="/labs">
                Labs
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink tag={ NV } to="/assignments">
                Assignments
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink tag={ NV } to="/results">
                Results
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink tag={ NV } to="/quiz">
                Quiz
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink tag={ NV } to="/files">
                Files
              </NavLink>
            </NavItem>
          </Nav>
          <Nav className="ml-auto" navbar>
            <NavItem>
              <NavLink>
                <i className="fa fa-envelope clickable"/>
              </NavLink>
            </NavItem>
            <UncontrolledDropdown nav inNavbar>
              <DropdownToggle nav caret>
                { this.props.isAdmin ? "Admin" : "Student" }
              </DropdownToggle>
              <DropdownMenu right>
                <DropdownItem>Account settings</DropdownItem>
                <DropdownItem
                  className="clickable"
                  onClick={ () => this.props.setUserAdmin(!this.props.isAdmin) }
                >
                  Change to { this.props.isAdmin ? "Student" : "Admin" }
                </DropdownItem>
                <DropdownItem divider/>
                <DropdownItem>Log out</DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </Nav>
        </Collapse>
      </Navbar>
    );
  }
}

const mapStateToProps = ({userReducer}) => {
  const {isAdmin} = userReducer;
  return {
    isAdmin
  };
};

export default connect(mapStateToProps, {setUserAdmin})(PageHeader);
