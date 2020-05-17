import React, { Component } from 'react';
import {Button, Form, Modal, OverlayTrigger, Tooltip} from 'react-bootstrap';
import Chips from 'react-chips';

import utility from '../../../js/lib/utility';
import $ from 'jquery';
import { AjaxService, Routes } from '../../../js/ajax/ajax';
import {MainNavBar__Toast} from "../navbar/navbar";
 
var ShowEditAudioModal = function (data) {
    this.setState({ show: true, audioId: data });
    if(data != null) {
        AjaxService.get(Routes.XMUSIC_GET_AUDIO_BY_ID(data), function(response) {
            var data = JSON.parse(response.data);
            var keywords = [];
            if(typeof data.keywords == 'object') {
                keywords = data.keywords
            } else if (typeof data.keywords == 'string') {
                keywords= data.keywords.split(',')
            }
            this.setState({ 
                songTitle: data.songTitle, 
                description: data.description,
                keywords: keywords
            })
        }.bind(this), function(error) {
            console.log(error);
            MainNavBar__Toast('err', "Error. Some Error while fetching Informations");
        })
    }
}

class XMusicEditAudio extends Component {

    constructor(props) {
        super(props);
        this.state = { show: false, audioId: null, keywords: [], songTitle: '', description: '' };
        ShowEditAudioModal = ShowEditAudioModal.bind(this);
    }

    handleCloseModal = (event) => {
        event.preventDefault();
        this.setState({ show: false, audioId: null });
    }

    songTitleChange() {
        this.setState({
            songTitle: $('#editAudioModalForm__songTitle').val(),
            keywords: this.state.keywords,
            description: this.state.description
        });
    }

    songDescriptionChange() {
        this.setState({
            songTitle: this.state.songTitle,
            keywords: this.state.keywords,
            description: $('#editAudioModalForm__description').val()
        });
    }

    addHashtag(keywords) {
        if (keywords.length > 0 ) {
            let newElement = keywords[keywords.length-1];
            newElement = newElement.trim().replace(/\s\s+/g, ' ').split(' ').join('_');
            keywords[keywords.length-1] = newElement.trim();
        }
        //Maximum of 25 tags
        if (keywords.length > 25) {
            return false;
        }
        /**
         * Check the last one for any special character apart from _ and if there is one then done excpet it and return false.
         */
        this.setState({
            description: this.state.description,
            songTitle: this.state.songTitle,
            keywords: keywords
        });
    }

    handleUpdateAudio = event => {
        event.preventDefault();
        if (this.state.songTitle === null || this.state.songTitle === undefined) {
            MainNavBar__Toast('err', "Error. Title must be between 10 to 60 characters.");
            return false;
        }
        
        let songTitle = this.state.songTitle.trim().replace(/\s\s+/g, ' ');
        if (songTitle.length < 10 && songTitle.length < 61) {
            MainNavBar__Toast('err', "Error. Title must be between 10 to 60 characters.");
            return false;
        }
        
        if (this.state.keywords.length < 4) {
            MainNavBar__Toast('err', "Error. You must have atleast 4 keywords.");
            return false;
        } 

        
        if (this.state.description === '' || this.state.description === null) {
            MainNavBar__Toast('err', "Error. You must have a song description");
            return false;
        }
        let data = utility.getFormData(($('form#editAudioModalForm').serializeArray()));
        let audioUpdateData = {
            songTitle: data.songTitle,
            description: data.description,
            keywords: this.state.keywords
        }
        AjaxService.put(Routes.XMUSIC_UPDATE_AUDIO(this.state.audioId), audioUpdateData, function (response) {
            this.setState({show: false, keywords: [], songTitle: '', description: '' });
            MainNavBar__Toast('success', "Song updated successfully");
            setTimeout(function(){ window.location.reload() }, 1500);
        }.bind(this), function (error) {
            MainNavBar__Toast('err', "Error. "+ error.responseJSON.message);
            console.log(error);
        },
        {
            onComplete: function () {
                $('button#editAudioModalForm__btnConfirmUpdateAudio').removeAttr('disabled');
                $('button#editAudioModalForm__btnCancelEditAudio').removeAttr('disabled');
                $('button#editAudioModalForm__btnUplodSong').html('Update');
            },
        }, {
            beforeSend: function () {
                $('button#editAudioModalForm__btnConfirmUpdateAudio').html('Updating...');
                $('button#editAudioModalForm__btnConfirmUpdateAudio').prepend("<span class='spinner-grow spinner-grow-sm' role='status' aria-hidden='true'></span>")
                $('button#editAudioModalForm__btnConfirmUpdateAudio').attr('disabled', 'disabled');
                $('button#editAudioModalForm__btnCancelEditAudio').attr('disabled', 'disabled');
            }
        });
    }

    render() {
        return (
            <React.Fragment>
                <Modal id="xMusic__editAudioModal" centered show={this.state.show} onHide={() => this.handleCloseModal()}>
                    <Modal.Header>
                        <h4 className="montserrat-light">Edit Audio</h4>
                    </Modal.Header>
                    <Modal.Body>
                        <Form id="editAudioModalForm" name="editAudioModalForm">
                            <Form.Group controlId="editAudioModalForm__songTitle">
                                <OverlayTrigger
                                    placement="right"
                                    overlay={
                                        <Tooltip>
                                            Edit the song name
                                        </Tooltip>
                                    }
                                >
                                    <Form.Label className="text-x-default margin-top-10">Song Title</Form.Label>
                                </OverlayTrigger>
                                <Form.Control name="songTitle" type="text" maxLength="60" value={this.state.songTitle} onChange={() => this.songTitleChange()}/>
                                <Form.Text className="text-muted">
                                    Maximun 60 characters
                                </Form.Text>
                            </Form.Group>
                            <Form.Group controlId="editAudioModalForm__keywords">
                                <OverlayTrigger
                                    placement="right"
                                    overlay={
                                        <Tooltip>
                                            Edit your SEO Keywords for your song.
                                        </Tooltip>
                                    }
                                >
                                    <Form.Label className="text-x-default">SEO Keywords (don't use #) - Use 'Tab' to seperate</Form.Label>
                                </OverlayTrigger>
                                <Chips
                                    name="seoKeywords"
                                    value={this.state.keywords}
                                    onChange={(e) => this.addHashtag(e)}
                                />
                            </Form.Group>
                            <Form.Group controlId="editAudioModalForm__description">
                                <OverlayTrigger
                                    placement="right"
                                    overlay={
                                        <Tooltip>
                                            Edit description about your song.
                                        </Tooltip>
                                    }
                                >
                                    <Form.Label className="text-x-default">About The Song</Form.Label>
                                </OverlayTrigger>
                                <Form.Control name="description" as="textarea" rows="4" value={this.state.description} onChange={() => this.songDescriptionChange()}/>
                            </Form.Group>
                            <Button variant="danger" type="submit" className="right" sm="2" id="xMusic__btnConfirmUpdateAudio" onClick={this.handleUpdateAudio} >Update</Button>
                            <Button variant="outline-x-dark-default" className="right margin-right-5" id="xMusic__btnCancelEditAudio" onClick={this.handleCloseModal}>Cancel</Button>
                        </Form>
                    </Modal.Body>
                </Modal>
            </React.Fragment>
        );
    }
}

export { XMusicEditAudio, ShowEditAudioModal };