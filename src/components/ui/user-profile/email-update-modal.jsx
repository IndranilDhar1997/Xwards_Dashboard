import React, { Component } from "react";
import {Form, Button, Modal} from 'react-bootstrap';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

import FormValidator from "../../../js/validations/formvalidator";
import validations from "../../../js/validations/validations";
import utility from '../../../js/lib/utility';
import $ from 'jquery';
import { AjaxService, Routes } from '../../../js/ajax/ajax';

var EmailUpdateShowModal = function() {
    this.setState({ show: true});
}

class EmailUpdateModal extends Component {
    constructor() {
        super();

        this.validator = new FormValidator(validations.email_rules);

        this.state = {show : false}

        EmailUpdateShowModal = EmailUpdateShowModal.bind(this);
    }

    changeEmail = (event) => {
		event.preventDefault();
		let email = utility.getFormData(($('form#emailUpdateModalForm').serializeArray()));
		const validation = this.validator.validate(email);
		
		if (validation.isValid) {
			AjaxService.put(Routes.UPDATEUSEREMAIL(), email, function (response) {
                $('#myProfile__emailUpdateModal #success-message').html(response.message);
                $('#emailUpdateModalForm__newEmail__msg').html('');
                $('#myProfile__emailUpdateModal #error-message').html('');
            }, function(error) {
                $('#myProfile__emailUpdateModal #error-message').html(error.responseJSON.message);
                $('#emailUpdateModalForm__newEmail__msg').html('');
                $('#myProfile__emailUpdateModal #success-message').html('');
            }, {
					onComplete: function () {
						$('button#emailUpdateModalForm__btnVerifyEmail').removeAttr('disabled');
						$('button#emailUpdateModalForm__btnVerifyEmail').html('Send Request');
					},
					beforeSend: function () {
						$('button#emailUpdateModalForm__btnVerifyEmail').html('Sending request...');
						$('button#emailUpdateModalForm__btnVerifyEmail').prepend("<span class='spinner-grow spinner-grow-sm' role='status' aria-hidden='true'></span>")
						$('button#emailUpdateModalForm__btnVerifyEmail').attr('disabled', 'disabled');
					}
                } 
			);
		} else {
            if (validation.newEmail.isInvalid) {
                $('#emailUpdateModalForm__newEmail__msg').html(validation.newEmail.message);
            }
        }    	
	}
	
	handleClose = () => {
		this.setState({ show: false });
    }

    render() {
		return (
            <Modal id="myProfile__emailUpdateModal" centered show={this.state.show} onHide={this.handleClose.bind(this)}>
                <Modal.Header closeButton={true} >
                    <h4 className="montserrat-light">Update Email Address</h4>
                </Modal.Header>
                <Modal.Body className="padding-top-0">
                    <Form name="emailUpdateModalForm" id="emailUpdateModalForm">
                        <Form.Group controlId="emailUpdateModalForm__newEmail">
                            <Form.Label>Enter new email address</Form.Label>
                            <OverlayTrigger
                                placement="right"
                                overlay={
                                    <Tooltip>
                                        Please enter new email address.
                                    </Tooltip>
                                }
                            >
                            <Form.Control name="newEmail" type="text"/>
                            </OverlayTrigger>
                            <span className="text-x-love text-md" id="emailUpdateModalForm__newEmail__msg"></span>
                        </Form.Group>
                        <div className="text-success font-weight-800 margin-bottom-10" id="success-message"></div>
                        <div className="text-x-love font-weight-800 margin-bottom-10" id="error-message"></div>
                        <Button variant="x-dark-default" type="submit" id="emailUpdateModalForm__btnVerifyEmail" className="right margin-left-5" onClick={this.changeEmail}>
                            Send Request
                        </Button>
                        <Button variant="outline-x-love" className="right margin-right-5" onClick={this.handleClose}>
                            Close
                        </Button>
                    </Form>	
                </Modal.Body>
            </Modal>
        )
    }
}

export {EmailUpdateModal, EmailUpdateShowModal}