import React, { Component } from "react";
import {Form, Button, Modal} from 'react-bootstrap';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

import FormValidator from "../../../js/validations/formvalidator";
import validations from "../../../js/validations/validations";
import utility from '../../../js/lib/utility';
import $ from 'jquery';
import { AjaxService, Routes } from '../../../js/ajax/ajax';


var ChangePasswordShowModal = function () {
    this.setState({ show: true});
}

class ChangePasswordModal extends Component {
    constructor() {
        super();
        this.validator = new FormValidator(validations.password_rules);
        this.state = { show: false }
        ChangePasswordShowModal = ChangePasswordShowModal.bind(this);
    }

    handleClose = () => {
        this.setState({ show: false });
    }

    changePassword = (event) => {
        event.preventDefault();
        let formData = utility.getFormData(($('form#changePasswordModalForm').serializeArray()));
        const validation = this.validator.validate(formData);

        if (validation.isValid) {
            AjaxService.put(Routes.UPDATEUSERPASSWORD(), formData, function (response) {
                $('#myProfile__changePasswordModal #success-message').html(response.message);
                $('#changePasswordModalForm__password__msg').html('');
                $('#changePasswordModalForm__newPassword__msg').html('');
                $('#changePasswordModalForm__confirmPassword__msg').html('');
                $('#myProfile__changePasswordModal #error-message').html('');
            }, function (error) {
                console.log(error)
                $('#myProfile__changePasswordModal #error-message').html(error.responseText);
                $('#changePasswordModalForm__password__msg').html('');
                $('#changePasswordModalForm__newPassword__msg').html('');
                $('#changePasswordModalForm__confirmPassword__msg').html('');
                $('#myProfile__changePasswordModal #success-message').html('');
            }, {
                    onComplete: function () {
                        $('button#changePasswordModalForm__btnChangePassword').removeAttr('disabled');
                        $('button#changePasswordModalForm__btnChangePassword').html('Change Password');
                    },
                    beforeSend: function () {
                        $('button#changePasswordModalForm__btnChangePassword').html('Changing Password...');
                        $('button#changePasswordModalForm__btnChangePassword').prepend("<span class='spinner-grow spinner-grow-sm' role='status' aria-hidden='true'></span>")
                        $('button#changePasswordModalForm__btnChangePassword').attr('disabled', 'disabled');
                    }
                }
            );
        } else {
            if (validation.password.isInvalid) {
                $('#changePasswordModalForm__password__msg').html(validation.password.message);
            }
            if (validation.newPassword.isInvalid) {
                $('#changePasswordModalForm__newPassword__msg').html(validation.newPassword.message);
            }
            if (validation.confirmPassword.isInvalid) {
                $('#changePasswordModalForm__confirmPassword__msg').html(validation.confirmPassword.message);
            }
        }	
    }

    render() {
        return (
            <Modal id="myProfile__changePasswordModal" centered show={this.state.show} onHide={this.handleClose.bind(this)}>
                <Modal.Header closeButton={true} >
                    <h4 className="montserrat-light">Change password</h4>
                </Modal.Header>
                <Modal.Body className="padding-top-0">
                    <Form name="changePasswordModalForm" id="changePasswordModalForm">
                        <Form.Group controlId="changePasswordModalForm__userPassword">
                            <Form.Label>Enter current password</Form.Label>
                            <OverlayTrigger
                                placement="right"
                                overlay={
                                    <Tooltip>
                                        Please enter the current password.
                                    </Tooltip>
                                }
                            >
                                <Form.Control name="password" type="password"/>
                            </OverlayTrigger>
                            <span className="text-x-love text-md" id="changePasswordModalForm__password__msg"></span>
                        </Form.Group>
                        <Form.Group controlId="changePasswordModalForm__newPassword">
                            <Form.Label>Enter new password</Form.Label>
                            <OverlayTrigger
                                placement="right"
                                overlay={
                                    <Tooltip>
                                        Please enter the new password.
                                    </Tooltip>
                                }
                            >
                                <Form.Control name="newPassword" type="password"/>
                            </OverlayTrigger>
                            <span className="text-x-love text-md" id="changePasswordModalForm__newPassword__msg"></span>
                        </Form.Group>
                        <Form.Group controlId="changePasswordModalForm__confirmPassword">
                            <Form.Label>Confirm new password</Form.Label>
                            <OverlayTrigger
                                placement="right"
                                overlay={
                                    <Tooltip>
                                        Please confirm the new password.
                                    </Tooltip>
                                }
                            >
                                <Form.Control name="confirmPassword" type="password" />
                            </OverlayTrigger>
                            <span className="text-x-love text-md" id="changePasswordModalForm__confirmPassword__msg"></span>
                        </Form.Group>
                        <div className="text-success font-weight-800 margin-bottom-10" id="success-message"></div>
                        <div className="text-x-love font-weight-800 margin-bottom-10" id="error-message"></div>
                        <Button variant="x-dark-default" type="submit" id="changePasswordModalForm__btnChangePassword" className="right margin-left-5" onClick={this.changePassword}>
                            Change password
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

export {ChangePasswordModal, ChangePasswordShowModal};
