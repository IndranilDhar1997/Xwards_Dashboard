/**
 * Developed by Veer Shrivastav
 * Date: 24th May 2019
 * 
 * Purpose: All the user related routes and functions are written here.
 */
//Utility functions

import React, { Component } from "react";
import Dropdown from 'react-bootstrap/Dropdown';
import UserProfileService from '../../../js/services/userProfile';
import {AjaxService, Routes} from '../../../js/ajax/ajax';
import Config from '../../../config';

var UserDropDown__LoadUserData = function (user) {
    this.setState({loaded: true});
}

class UserDropDown extends Component {
    constructor(props) {
        super(props);
        this.state = {loaded: false}
        UserDropDown__LoadUserData = UserDropDown__LoadUserData.bind(this);
    }

    logout() {
        AjaxService.get(Routes.LOGOUT(), function (data) {
            localStorage.clear();
            window.location.replace(Config[Config.env].MAINSITE);
        }, function(err) {
            localStorage.clear();
            window.location.replace(Config[Config.env].MAINSITE);
        });
    }

    render () {
        return (
            <Dropdown>
                <Dropdown.Toggle variant="x-transparent" id="user-dropdown" bsPrefix="btn-sm btn-link text-x-default">
                    {UserProfileService.getUser() && UserProfileService.getUser().first_name} <i className="margin-left-5 fas fa-caret-down"></i>
                </Dropdown.Toggle>

                <Dropdown.Menu alignRight={true}>
                    <Dropdown.Item href="/user/profile" bsPrefix="dropdown-item"><i className="far fa-id-card margin-right-10"></i> Personal Info</Dropdown.Item>
                    <Dropdown.Item href="/user/team" bsPrefix="dropdown-item"><i className="fas fa-user-friends margin-right-10"></i> Team Management</Dropdown.Item>
                    <Dropdown.Item href="/user/billing" bsPrefix="dropdown-item"><i className="fas fa-credit-card margin-right-10"></i> Payment Modes</Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item href="/help-and-support" bsPrefix="dropdown-item"><i className="fas fa-life-ring margin-right-10"></i> Need Help?</Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item bsPrefix="dropdown-item" onClick={()=>this.logout()}><i className="fas fa-power-off margin-right-10"></i> Logout</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        );
    }
}

export {UserDropDown, UserDropDown__LoadUserData};