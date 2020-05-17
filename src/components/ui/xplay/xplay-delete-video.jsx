import React, {Component} from 'react';
import {Button, Form, Modal} from 'react-bootstrap';
import Config from "../../../config";

import utility from '../../../js/lib/utility';
import $ from 'jquery';
import { AjaxService, Routes } from '../../../js/ajax/ajax';
import {MainNavBar__Toast} from '../../ui/navbar/navbar';

// Opening  Modal for deleting the in-review video
var ShowDeleteVideoModal = function() {
    this.setState({ show: true});
}


class XPlayDeleteVideo extends Component {

    constructor(props) {
        super(props);	
        this.state = { show: false }
        ShowDeleteVideoModal = ShowDeleteVideoModal.bind(this);

    }

    // Closing  Modal for deleting the in-review video
    handleCloseModal = (event) => {
        event.preventDefault();
        this.setState({ show: false})
	}

    //Function to handle the delete in-video request to the server
    handleDeleteVideo = event => {
        event.preventDefault();
        let data = utility.getFormData(($('form#deleteVideoModalForm').serializeArray()));
        if (data[Object.keys(data)[0]] === 'DELETE') {
            console.log(data);
            console.log(this.props)
            AjaxService.delete(Routes.XPLAY_DELETE_VIDEO(this.props.videoId, this.props.channelId), function (response) {
                MainNavBar__Toast('success', "Successfully Deleted");
                setTimeout(function () { window.location.replace(Config[Config.env].url+"/xplay/channel/") }, 500);
                window.location.replace(Config[Config.env].url+"/xplay/channel");
            }, function (error) {
                console.log(error)
                MainNavBar__Toast('err', "Error in deleting video");
            }, {
                    onComplete: function () {
                        this.setState({ show: false})
                    }.bind(this),
                    beforeSend: function () {
                        $('button#xPlay__btnConfirmDeleteVideo').html('Deleting Video...');
                        $('button#xPlay__btnConfirmDeleteVideo').prepend("<span class='spinner-grow spinner-grow-sm' role='status' aria-hidden='true'></span>")
                        $('button#xPlay__btnConfirmDeleteVideo').attr('disabled', 'disabled');
                        $('button#xPlay__btnCancelDeleteVideo').attr('disabled', 'disabled');
                    }
                }
            );
        }
    }

    render() {
        return (
            <React.Fragment>
                {/* Modal to delete the in-review and confirming by typing 'DELETE' in the input field */}
                <Modal id="xPlay__deleteVideoModal" centered show={this.state.show} onHide={() => this.handleCloseModal()}>
                    <Modal.Header>
                        <h4 className="montserrat-light">Delete Video</h4>
                    </Modal.Header>
                    <Modal.Body>
                        <Form id="deleteVideoModalForm" name="deleteVideoModalForm">
                            <Form.Group controlId="deleteVideoModalForm">
                                <Form.Label>
                                    Type 'DELETE' to delete this video
                                </Form.Label>
                                <Form.Control name="deleteVideo" type="text" />
                            </Form.Group>
                            <Button variant="danger" type="submit" className="right" sm="2" id="xPlay__btnConfirmDeleteVideo" onClick={this.handleDeleteVideo} >Confirm</Button>
                            <Button variant="outline-x-dark-default" className="right margin-right-5" id="xPlay__btnCancelDeleteVideo" onClick={this.handleCloseModal}>Cancel</Button>
                        </Form>
                    </Modal.Body>
                </Modal>
            </React.Fragment>
        )
    }
}

export {XPlayDeleteVideo, ShowDeleteVideoModal}