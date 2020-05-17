import React, {Component} from 'react';
import {Button, Form, Modal} from 'react-bootstrap';
import Config from "../../../config";

import utility from '../../../js/lib/utility';
import $ from 'jquery';
import { AjaxService, Routes } from '../../../js/ajax/ajax';
import {MainNavBar__Toast} from "../navbar/navbar";

import 'react-toastify/dist/ReactToastify.css';

// Function to open the modal for deletion of the channel
var ShowDeleteChannelModal = function() {
    this.setState({ show: true});
}


class XPlayDeleteChannel extends Component {

    constructor(props) {
        super(props);	
        this.state = { show: false }

        ShowDeleteChannelModal = ShowDeleteChannelModal.bind(this);

    }

    // Close the delete channel modal
    handleCloseModal = (event) => {
        event.preventDefault();
        this.setState({ show: false})
	}

   
    // Function to handle the delete channel request to the server
    handleDeleteChannel = event => {
        event.preventDefault();
        let data = utility.getFormData(($('form#deleteChannelModalForm').serializeArray()));
        if (data[Object.keys(data)[0]] === 'DELETE') {
            AjaxService.delete(Routes.XPLAY_DELETE_CHANNEL(this.props.channelId), function (response) {
                MainNavBar__Toast('success', "Channel deleted successfully");
                window.location.replace(Config[Config.env].url+"/xplay/channel");
            }, function (error) {
                MainNavBar__Toast('err', "Some error occured");
            }, {
                    onComplete: function () {
                        this.setState({ show: false})
                    }.bind(this),
                    beforeSend: function () {
                        $('button#xPlay__btnConfirmDeleteChannel').html('Deleting Channel...');
                        $('button#xPlay__btnConfirmDeleteChannel').prepend("<span class='spinner-grow spinner-grow-sm' role='status' aria-hidden='true'></span>")
                        $('button#xPlay__btnConfirmDeleteChannel').attr('disabled', 'disabled');
                    }
                }
            );
        }
        else {
            MainNavBar__Toast('err', "Type 'DELETE' to delete the channel" );
        }

    }

    render() {
        return (
            <React.Fragment>
                {/* Modal to delete the channel and confirming by typing 'DELETE' in the input field */}
                <Modal id="xPlay__deleteChannelModal" centered show={this.state.show} onHide={() => this.handleCloseModal()}>
                    <Modal.Header>
                        <h4 className="montserrat-light">Delete Channel</h4>
                    </Modal.Header>
                    <Modal.Body>
                        <Form id="deleteChannelModalForm" name="deleteChannelModalForm">
                            <Form.Group controlId="deleteChannelModalForm">
                                <Form.Label>
                                    Type 'DELETE' to delete this channel
                                </Form.Label>
                                <Form.Control name="deleteChannel" type="text" />
                            </Form.Group>
                            <Button variant="danger" type="submit" className="right" sm="2" id="xPlay__btnConfirmDeleteChannel" onClick={this.handleDeleteChannel} >Confirm</Button>
                            <Button variant="outline-x-dark-default" className="right margin-right-5" onClick={this.handleCloseModal}>Cancel</Button>
                        </Form>
                    </Modal.Body>
                </Modal>
            </React.Fragment>
        )
    }
}

export {XPlayDeleteChannel, ShowDeleteChannelModal}