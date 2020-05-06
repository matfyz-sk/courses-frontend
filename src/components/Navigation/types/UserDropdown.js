import React from 'react';
import {Link} from 'react-router-dom';
import {
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  UncontrolledDropdown,
} from 'reactstrap';
import { logout } from '../../Auth'

const UserDropdown = props => (
  <>
    <UncontrolledDropdown nav inNavbar>
      <DropdownToggle nav caret className="profile-settings">
        <div className="d-md-none d-sm-inline-block profile-icon">
          {props.name ? props.name.charAt(0) : null}
        </div>
        <div className="d-none d-md-inline-block">{props.name}</div>
      </DropdownToggle>
      <DropdownMenu right>
        <DropdownItem>
          <Link to="/profile-settings">Profile settings</Link>
        </DropdownItem>
        <DropdownItem>
          <Link to="/privacy-settings">Privacy settings</Link>
        </DropdownItem>
        <DropdownItem divider />
        <DropdownItem
          onClick={() => {
            logout();
          }}
        >
          Logout
        </DropdownItem>
      </DropdownMenu>
    </UncontrolledDropdown>
  </>
);

export default UserDropdown;
