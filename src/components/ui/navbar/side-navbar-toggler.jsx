/**
 * Developed by Veer Shrivastav
 * Date: 24th May 2019
 * 
 * Purpose: The sidenav bar routes are defined here.
 */
import React, { Component } from "react";
import { Link } from 'react-router-dom';
import {SideNavMenuOptions} from '../../ui/navbar/navbar';
import Config from "../../../config";

var SideNavBarToggler__SetActiveMenu = function (menu) {
    this.setState({open: false, location: menu});
}

class SideNavBarToggler extends Component {
    constructor(props) {
        super(props);
        this.state = {open: false, location: window.location.pathname}
        this.ImageUrl = Config[Config.env].url;
        SideNavBarToggler__SetActiveMenu = SideNavBarToggler__SetActiveMenu.bind(this);
    }

    dontClose(e) {
        e.stopPropagation();
    }

    toggleSideBar() {
        this.setState({open: !this.state.open, location: this.state.location});
    }

    updateListActive(route) {
        this.setState({open: false, location: route});
    }

    render () {
        return (
            <React.Fragment>
                <button className="btn btn-sm btn-outline-x-default margin-right-10 d-block d-md-none" onClick={() => this.toggleSideBar()}><i className="fas fa-bars"></i></button>
                <div className={"slider " + (this.state.open ? '' : 'hide')} onClick={() => this.toggleSideBar()}>
                    <div className="sideMenu" onClick={(e) => this.dontClose(e)}>
                        <div className="container">
                            <div className="row">
                                <div className="col col-12 padding-bottom-15 padding-left-0 padding-right-0">
                                    <div className="padding-top-15 padding-left-15 padding-right-15 padding-bottom-20">
                                        <img src={this.ImageUrl + "/images/xds-nav.svg"} alt="Xwards" />
                                    </div>
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
                </div>
            </React.Fragment>
        );
    }
}

export {SideNavBarToggler, SideNavBarToggler__SetActiveMenu};