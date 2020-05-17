import React, {Component} from 'react';
import {Button, Form, Modal} from 'react-bootstrap';
import Config from "../../../config";

import utility from '../../../js/lib/utility';
import $ from 'jquery';
import { AjaxService, Routes } from '../../../js/ajax/ajax';

var ShowDeleteAudioModal = function(data) {
    this.setState({ show: true, audioId: data});
}


class XMusicDeleteAudio extends Component {

    constructor(props) {
        super(props);	
        this.state = { show: false, audioId: null }
        ShowDeleteAudioModal = ShowDeleteAudioModal.bind(this);
    }

    handleCloseModal = (event) => {
        event.preventDefault();
        this.setState({ show: false})
	}

    handleDeleteVideo = event => {
        event.preventDefault();
        let data = utility.getFormData(($('form#deleteAudioModalForm').serializeArray()));
        if (data[Object.keys(data)[0]] === 'DELETE') {
            console.log(data);
            console.log(this.state.audioId)
            AjaxService.delete(Routes.XMUSIC_DELETE_AUDIO(this.state.audioId), function (response) {
                $('#deleteAudioModalForm #success-message').html(response.message);
                $('#deleteAudioModalForm #error-message').html('');
                window.location.replace(Config[Config.env].url+"/xmusic/audios");
            }, function (error) {
                $('#editAudioModalForm #error-message').html(error.responseJSON.message);
                $('#editAudioModalForm #success-message').html('');
                console.log(error)
            }, {
                    onComplete: function () {
                        this.setState({ show: false})
                    }.bind(this),
                    beforeSend: function () {
                        $('button#xMusic__btnConfirmDeleteAudio').html('Deleting Audio...');
                        $('button#xMusic__btnConfirmDeleteAudio').prepend("<span class='spinner-grow spinner-grow-sm' role='status' aria-hidden='true'></span>")
                        $('button#xMusic__btnConfirmDeleteAudio').attr('disabled', 'disabled');
                        $('button#xMusic__btnCancelDeleteAudio').attr('disabled', 'disabled');
                    }
                }
            );
        }
    }

    render() {
        return (
            <React.Fragment>
                <Modal id="xMusic__deleteAudioModal" centered show={this.state.show} onHide={() => this.handleCloseModal()}>
                    <Modal.Header>
                        <h4 className="montserrat-light">Delete Audio</h4>
                    </Modal.Header>
                    <Modal.Body>
                        <Form id="deleteAudioModalForm" name="deleteAudioModalForm">
                            <Form.Group controlId="deleteAudioModalForm">
                                <Form.Label>
                                    Type 'DELETE' to delete this audio
                                </Form.Label>
                                <Form.Control name="deleteAudio" type="text" />
                            </Form.Group>
                            <Button variant="danger" type="submit" className="right" sm="2" id="xMusic__btnConfirmDeleteAudio" onClick={this.handleDeleteVideo} >Confirm</Button>
                            <Button variant="outline-x-dark-default" className="right margin-right-5" id="xMusic__btnCancelDeleteVideo" onClick={this.handleCloseModal}>Cancel</Button>
                        </Form>
                    </Modal.Body>
                </Modal>
            </React.Fragment>
        )
    }
}

export {XMusicDeleteAudio, ShowDeleteAudioModal}