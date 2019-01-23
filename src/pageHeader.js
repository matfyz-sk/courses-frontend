import React, { Component } from 'react';
import {
Navbar,
NavbarBrand,
NavLink,
NavItem,
DropdownMenu,
DropdownItem,
DropdownToggle,
Nav,
UncontrolledDropdown
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import UserStore from "./flux/stores/user";
import {switchUser} from './flux/actions';

export default class PageHeader extends Component{

  constructor(props){
    super(props);
    this.state={
      isAdmin:UserStore.isAdmin
    }
  }

  handleUserStoreChange(){
    this.setState({isAdmin:UserStore.isAdmin})
  }

  componentWillMount() {
  UserStore.on("change", this.handleUserStoreChange.bind(this) );
  }

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
            <NavLink onClick={()=>this.props.history.push('/info')} >Info</NavLink>
          </NavItem>
          <NavItem>
            <NavLink onClick={()=>this.props.history.push('/lectures')} >Lectures</NavLink>
          </NavItem>
          <NavItem>
            <NavLink onClick={()=>this.props.history.push('/labs')} >Labs</NavLink>
          </NavItem>
          <NavItem>
            <NavLink onClick={()=>this.props.history.push('/assignments')} >Assignments</NavLink>
          </NavItem>
          <NavItem>
            <NavLink onClick={()=>this.props.history.push('/results')} >Results</NavLink>
          </NavItem>
          <NavItem>
            <NavLink onClick={()=>this.props.history.push('/quiz')} >Quiz</NavLink>
          </NavItem>
          <NavItem>
            <NavLink onClick={()=>this.props.history.push('/files')} >Files</NavLink>
          </NavItem>
        </Nav>
          <Nav className="ml-auto" navbar>
            <NavItem>
              <NavLink>
                <FontAwesomeIcon
                  icon="envelope"
                />
              </NavLink>
            </NavItem>
            <UncontrolledDropdown nav inNavbar>
              <DropdownToggle nav caret>
                {this.state.isAdmin?'Admin':'Student'}
              </DropdownToggle>
              <DropdownMenu right>
                <DropdownItem>
                  Account settings
                </DropdownItem>
                <DropdownItem className="clickable" onClick={()=>switchUser(!this.state.isAdmin)}>
                  Change to {this.state.isAdmin?'Student':'Admin'}
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
