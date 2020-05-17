/**
 * Developed by Veer Shrivastav
 * Date: 24th May 2019
 * 
 * Purpose: The sidenav bar routes are defined here.
 */
import React, { Component } from "react";
import { Link } from 'react-router-dom';
import {SideNavMenuOptions, SideNavBarToggler__SetActiveMenu} from '../../ui/navbar/navbar';

var SideNavBar__SetActiveMenu = function (menu) {
    this.setState({location: menu});
    SideNavBarToggler__SetActiveMenu(menu);
}

class SideNavBar extends Component {
    constructor() {
        super();
        this.state = {location: window.location.pathname};
        SideNavBar__SetActiveMenu = SideNavBar__SetActiveMenu.bind(this);
    }

    updateListActive(route) {
        this.setState({location: route});
    }
    
    render () {
        return (
            <React.Fragment>
                <div className="dashboard-sidemenu body-holder">
                    <div className="container">
                        <div className="row">
                            <div className="col col-12 padding-bottom-15 padding-left-0 padding-right-0 padding-top-5">
                                <ul className="list-group">
                                    { SideNavMenuOptions.map(menu => (
                                        <Link key={menu.route} to={menu.route} onClick={() => this.updateListActive(menu.route)}>
                                            <li className={'list-group-item list-group-item-action cursor-pointer' + (this.state.location === menu.route ? ' active' : '')}>
                                                <i className={menu.icon + " margin-right-15"}></i> {menu.name}
                                            </li>
                                        </Link>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export {SideNavBar, SideNavBar__SetActiveMenu};