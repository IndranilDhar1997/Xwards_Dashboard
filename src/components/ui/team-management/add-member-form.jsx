import React, { Component } from "react";
import $ from 'jquery';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import {AjaxService, Routes} from '../../../js/ajax/ajax';
import utility from '../../../js/lib/utility';

import UserSearchDropDown from './user-search-drop-down';
import BrandService from '../../../js/services/brandService';

var updateRoleDropDown = function (roles) {
    this.setState({roles: roles});
}

class AddMemberForm extends Component {

    constructor() {
        super();
        this.state = {roles: []};
        updateRoleDropDown = updateRoleDropDown.bind(this);

        AjaxService.get(Routes.ROLE_DETAILS(), function(response) {
			updateRoleDropDown(response)
		}, function(error) {
			console.log(error);
		})
    }

    inviteMember() {
        $('#inviteMemberForm #success-message').html('');
        $('#inviteMemberForm #error-message').html('');
        let data = utility.getFormData(($('form#inviteMemberForm').serializeArray()));
        let inviteMemberData = { 
            brandId: BrandService.getSelectedBrand().id,
            email: data.email,
            name: data.name
        }
        AjaxService.post(Routes.INVITE_MEMBER(), inviteMemberData, function(response) {
            console.log(response);
            $('#inviteMemberForm #success-message').html(response);
        }, function(error) {
            console.log(error);
            $('#inviteMemberForm #error-message').html(error.responseText);
        }, {
            onComplete: function () {
                $('button#inviteMemberForm__btnInviteMember').removeAttr('disabled');
                $('button#inviteMemberForm__btnInviteMember').html('Invite Member');
                $('button#inviteMemberForm__btnInviteMember').prepend("<i class='fas fa-plus margin-right-10'></i>");
            },
            beforeSend: function () {
                $('button#inviteMemberForm__btnInviteMember').html('Sending Invitation...');
                $('button#inviteMemberForm__btnInviteMember').prepend("<span class='spinner-grow spinner-grow-sm' role='status' aria-hidden='true'></span>")
                $('button#inviteMemberForm__btnInviteMember').attr('disabled', 'disabled');
            }
        })
    }

    addMember() {
        let data = utility.getFormData(($('form#addMemberForm').serializeArray()));
        
		let memberData = {
			roleId: data.roleId,
			memberId: data.memberSearch,
			brandId: BrandService.getSelectedBrand().id
        }
        
		AjaxService.post(Routes.ADD_TEAM_MEMBER(), memberData, function(response) {
			window.location.reload();
		}, function(error) {
            console.error(error);
		}, {
            onComplete: function () {
                $('button#addMemberForm__btnAddMember').removeAttr('disabled');
                $('button#addMemberForm__btnAddMember').html('Add Member');
                $('button#addMemberForm__btnAddMember').prepend("<i class='fas fa-plus margin-right-10'></i>");
            },
            beforeSend: function () {
                $('button#addMemberForm__btnAddMember').html('Adding Brand...');
                $('button#addMemberForm__btnAddMember').prepend("<span class='spinner-grow spinner-grow-sm' role='status' aria-hidden='true'></span>")
                $('button#addMemberForm__btnAddMember').attr('disabled', 'disabled');
            }
        });
    }

    render () {
        return (
            <div className="row">
                <div className="col col-12">
                    <h6 className="margin-top-20">Enter Details to Invite New Member in this Brand</h6>
                    <Form className="margin-top-5 width-100" name="inviteMemberForm" id="inviteMemberForm">
                        <div className="row">
                           
                            <div className="col col-6">
                                <Form.Group controlId="inviteMemberForm__name">
                                    <Form.Control type="text" placeholder="Enter Full Name" name="name"/>
                                </Form.Group>
                            </div>
                            <div className="col col-6">
                                <Form.Group controlId="inviteMemberForm__email">
                                    <Form.Control type="email" placeholder="Enter email" name="email"/>
                                </Form.Group>
                            </div>
                        </div>
                        <div className="text-success font-weight-800 margin-bottom-10" id="success-message"></div>
                        <div className="text-x-love font-weight-800 margin-bottom-10" id="error-message"></div>
                        <Button variant="x-dark-default" className="right margin-left-5 margin-top-10" id="inviteMemberForm__btnInviteMember" onClick={() => this.inviteMember()}>
                            Invite Member <i className="far fa-share-square"></i>
                        </Button>
                    </Form>
                </div>
                <div className="col col-12">
                    <Form className="margin-top-20 width-100" name="addMemberForm" id="addMemberForm">
                        <div className="row">
                            <div className="col col-8">
                                <Form.Group controlId="addMemberForm__memberSearch">
                                    <Form.Label className="margin-bottom-10">Select Members to add</Form.Label>
                                    <UserSearchDropDown id="memberSearch" name="memberSearch" />
                                    <Form.Text className="text-muted">
                                        Search by email address to add...
                                    </Form.Text>
                                </Form.Group>
                            </div>
                            <div className="col col-4">
                                <Form.Group controlId="addMemberForm__roleId">
                                    <Form.Label className="margin-bottom-10">Choose Role</Form.Label>
                                    <Form.Control as="select" name="roleId">
                                        {this.state.roles.map((role) => <option key={role.id} value={role.id} name={role.id}>{role.name}</option>)}
                                    </Form.Control>
                                </Form.Group>
                            </div>
                        </div>
                        <Button variant="x-dark-default" className="right margin-left-5" id="addMemberForm__btnAddMember" onClick={() => this.addMember()}>
                            <i className="fas fa-plus margin-right-10"></i>Add Member
                        </Button>
                    </Form>
                </div>
            </div>
        );
    }
}

export default AddMemberForm;