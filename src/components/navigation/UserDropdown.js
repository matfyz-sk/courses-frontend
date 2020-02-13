import React from 'react';
import { Link } from "react-router-dom";
import {
    DropdownMenu,
    DropdownItem,
    DropdownToggle,
    UncontrolledDropdown
} from 'reactstrap';

const UserDropdown = (props) => (
    <React.Fragment>
        <UncontrolledDropdown nav inNavbar>
            <DropdownToggle nav caret>
                {props.name}
            </DropdownToggle>
            <DropdownMenu right>
                <DropdownItem>
                    <Link to={"/profile-settings"}>Profile settings</Link>
                </DropdownItem>
                <DropdownItem>
                    <Link to={"/privacy-settings"}>Privacy settings</Link>
                </DropdownItem>
                <DropdownItem divider />
                <DropdownItem>
                    Log out
                </DropdownItem>
            </DropdownMenu>
        </UncontrolledDropdown>
    </React.Fragment>
);

export default UserDropdown;