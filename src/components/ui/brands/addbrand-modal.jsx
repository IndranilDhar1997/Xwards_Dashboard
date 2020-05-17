/**
 * Developed by Veer Shrivastav
 * Date: 25th May 2019
 * 
 * Purpose: When you click add brand anywhere then this modal pops up.
 */
import React, { Component } from "react";
import Modal from 'react-bootstrap/Modal';
import ModalHeader from 'react-bootstrap/ModalHeader';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import $ from 'jquery';
import utility from '../../../js/lib/utility';
import { AjaxService, Routes } from '../../../js/ajax/ajax';
import {BrandDropDown__LoadBrandData} from '../navbar/navbar';
import BrandService from "../../../js/services/brandService";

var AddBrandShowModal = function () {
    this.setState({ show: true, successMessage: '' });
}

class AddBrandModal extends Component {
    constructor(props) {
        super(props);
        this.state = { show: false, successMessage: '' }
        AddBrandShowModal = AddBrandShowModal.bind(this);
    }

    hideModal() {
        this.setState({ show: false, successMessage: '' });
    }

    addBrand() {
        /**
         * Send Ajax to add a brand
         *      if success (add brand to the service and refresh page)
         *      else show error messgage
         */
        let data = utility.getFormData(($('form#addBrandForm').serializeArray()));
        AjaxService.post(Routes.ADDBRAND(), data, function (response) {
            $('#brandAddModal #success-message').html(response.message);
            $('#brandAddModal #addBrandForm__brandName').val('');
            $('#brandAddModal #addBrandForm__legalName').val('');
            BrandService.addBrandToList(response.brand);
            BrandDropDown__LoadBrandData();
            this.setState({ show: false });
            window.location.reload();
        }.bind(this), function (error) {
            $('#brandAddModal #error-message').html(error);
        }, {
                onComplete: function () {
                    $('button#addBrandForm__btnAddBrand').removeAttr('disabled');
                    $('button#addBrandForm__btnAddBrand').html('Add');
                    $('button#addBrandForm__btnAddBrand').prepend("<i class='fas fa-plus margin-right-10'></i>");
                },
                beforeSend: function () {
                    $('button#addBrandForm__btnAddBrand').html('Adding Brand...');
                    $('button#addBrandForm__btnAddBrand').prepend("<span class='spinner-grow spinner-grow-sm' role='status' aria-hidden='true'></span>")
                    $('button#addBrandForm__btnAddBrand').attr('disabled', 'disabled');
                }
            });
    }

    render() {
        return (
            <Modal show={this.state.show} id="brandAddModal" centered={true} onHide={() => this.hideModal()}>
                <ModalHeader closeButton={true}>
                    <h4 className="montserrat-light">Add a Brand</h4>
                </ModalHeader>
                <Modal.Body className="padding-top-0">
                    <Form name="addBrandForm" id="addBrandForm">
                        <Form.Group controlId="addBrandForm__brandName">
                            <Form.Text className="text-muted margin-bottom-10 padding-left-5">
                                You can add brands related to your organization and maintain each campaign independently from the brands.
                            </Form.Text>
                            <Form.Label className="padding-left-5">Brand Name</Form.Label>
                            <Form.Control type="text" placeholder="Brand Name" name="brandName" />
                        </Form.Group>
                        <Form.Group controlId="addBrandForm__legalName">
                            <Form.Label className="padding-left-5">Legal Name</Form.Label>
                            <Form.Control type="text" placeholder="Legal Entity Name or Billing Name" name="legalName" />
                        </Form.Group>
                        <div className="text-success font-weight-800 margin-bottom-10" id="success-message"></div>
                        <div className="text-x-love font-weight-800 margin-bottom-10" id="error-message"></div>
                        <Button variant="x-dark-default" className="right margin-left-5" id="addBrandForm__btnAddBrand" onClick={() => this.addBrand()}>
                            <i className="fas fa-plus margin-right-10"></i>Add
                        </Button>
                        <Button variant="outline-x-love" className="right margin-right-5" onClick={() => this.hideModal()}>
                            Close
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        );
    }
}

export { AddBrandModal, AddBrandShowModal };