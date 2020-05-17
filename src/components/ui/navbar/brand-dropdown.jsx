/**
 * Developed by Veer Shrivastav
 * Date: 24th May 2019
 * 
 * Purpose: The brand dropdown on the navbar must be updated everytime.
 * The default dropdown of the ReactBootstrap doesn't update the UI.
 */
import React, { Component } from "react";
import Dropdown from 'react-bootstrap/Dropdown';
import BrandService from '../../../js/services/brandService'; //Brand Service
import { AddBrandModal, AddBrandShowModal } from '../brands/brands';

var BrandDropDown__LoadBrandData = function () {
    if (localStorage.getItem('selectedBrand') !== null && localStorage.getItem('selectedBrand') !== undefined) { //Something in Local Storage
        BrandService.setSelectedBrand(localStorage.getItem('selectedBrand').id);
    }
    this.setState({loaded: true});
}

class BrandDropDown extends Component {

    constructor(props) {
        super(props);
        this.state = {loaded: false};
        BrandDropDown__LoadBrandData = BrandDropDown__LoadBrandData.bind(this);
    }

    changeBrand(brand) {
        BrandService.setSelectedBrand(brand.id);
        this.setState({loaded: true});
        window.location.reload();
    }

    render() {
        return (
            <React.Fragment>
                <Dropdown>
                    <Dropdown.Toggle variant="x-transparent" id="brand-dropdown" bsPrefix="btn-sm btn-link text-x-default">
                        <i className="fas fa-city margin-right-5"></i>
                        {BrandService.getSelectedBrand() === null && 'Choose a Brand'}
                        {BrandService.getSelectedBrand() !== null && BrandService.getSelectedBrand().name}
                        <i className="margin-left-5 fas fa-caret-down"></i>
                    </Dropdown.Toggle>

                    <Dropdown.Menu alignRight={true}>
                        {(BrandService.getBrandList() === null || BrandService.getBrandList().length === 0) &&
                            <Dropdown.Item bsPrefix="dropdown-item" disabled>No Brands</Dropdown.Item>
                        }
                        {BrandService.getBrandList() !== null && BrandService.getBrandList().map(brand => (
                            <Dropdown.Item onSelect={() => this.changeBrand(brand)} bsPrefix="dropdown-item" key={brand.id}>{brand.name}</Dropdown.Item>
                        ))}
                        <Dropdown.Divider />
                        <Dropdown.Item onClick={() => AddBrandShowModal()} bsPrefix="dropdown-item">Add Brand</Dropdown.Item>
                        <Dropdown.Item href="/brands" bsPrefix="dropdown-item">Manage Brands</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
                <AddBrandModal />
            </React.Fragment>
        );
    }
}

export { BrandDropDown, BrandDropDown__LoadBrandData };