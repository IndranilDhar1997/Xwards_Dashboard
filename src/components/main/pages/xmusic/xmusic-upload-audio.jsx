import React, { Component } from 'react';
import {SideNavBar__SetActiveMenu, MainNavBar__Toast} from "../../../ui/navbar/navbar";
import XUploadAudio from '../../../ui/utility/XUploadAudio';
import XUploadImage from '../../../ui/utility/XUploadImage';

import {Form, OverlayTrigger, Tooltip, Button} from 'react-bootstrap';
import $ from 'jquery';
import XmusicDataService from '../../../../js/services/xmusicDataService';
import utility from '../../../../js/lib/utility';
import { AjaxService, Routes } from '../../../../js/ajax/ajax';
import Chips from 'react-chips';
import Config from '../../../../config';

class XMusicUploadSong extends Component {

    constructor(props) {
        super(props);
        this.state = {
            img_thumbnail: null,
            img_mid: null,
            img_big: null,
            audio: null,
            hashtags: [],
        }
        this.thumbnail = {};
        SideNavBar__SetActiveMenu("/xmusic");
    }


    getAudio(audio) {
        this.setState({ audio: audio });
    }

    errorAudioUploading(err) {
        switch(err) {
            case 'MAX_FILE_SIZE':
                MainNavBar__Toast('err', "File is too big to upload. Max Size 20Mb");
                break;
            default:
                break;
        }
    }

    addImages(e, name) {
        var img = new Image();
        let reader = new FileReader();
        reader.readAsDataURL(e);
        reader.onload = (data) => {
            img.src = data.srcElement.result;
            img.onload = () => {
                var b64 = data.srcElement.result;
                var image = new Image();
                image.src = b64;
                let ImageURL = img.src;
                var block = ImageURL.split(";"); // Get the content type of the image
                var contentType = block[0].split(":")[1]; // In this case "image/png"
                // get the real base64 content of the file
                var realData = block[1].split(",")[1];// In this case "R0lGODlhPQBEAPeoAJosM...."
    
                // Convert it to a blob to upload
                var blob = utility.b64toBlob(realData, contentType);
                this.thumbnail['thumbnail_'+name] = blob;
                XmusicDataService.addImage(name, blob);
            }
        }
    }


    onImages(e, name) {
        let stateObj = {};
        stateObj['img_'+name] = e;
        this.setState(stateObj);
    }

    goBack() {
        this.props.history.push("/xmusic/audios");
    }


    addHashtag(hashtags) {
        if (hashtags.length > 0 ) {
            let newElement = hashtags[hashtags.length-1];
            newElement = newElement.trim().replace(/\s\s+/g, ' ').split(' ').join('_');
            hashtags[hashtags.length-1] = newElement.trim();
        }
        //Maximum of 25 tags
        if (hashtags.length > 25) {
            return false;
        }
        this.setState({ hashtags: hashtags });
    }

    createDataForUploading() {
        
        let songTitle = $('#uploadAudioForm__songTitle').val();
        let description = $('#uploadAudioForm__description').val();

        if(this.state.audio === null || this.state.audio === undefined) {
            MainNavBar__Toast('err', "Error. Must Upload a audio of MP3 format");
            return false;
        }

        if (songTitle === null || songTitle === undefined || songTitle === '') {
            MainNavBar__Toast('err', "Error. Title must be between 10 to 60 characters.");
            return false;
        }

        if (description === null || description === undefined || description === '') {
            MainNavBar__Toast('err', "Error. Description cannot be empty.");
            return false;
        }
        
        songTitle = songTitle.trim().replace(/\s\s+/g, ' ');

        if (songTitle.length < 10 && songTitle.length < 61) {
            MainNavBar__Toast('err', "Error. Title must be between 10 to 30 characters.");
            return false;
        }

        let data = {
            songTitle: songTitle,
            description: description,
            keywords: this.state.hashtags,
            audio: this.state.audio
        }

        console.log(data);

        let images = XmusicDataService.getNonNullImages();
        for (let i in images) {
            data[images[i].name] = images[i].image;
            delete images[i].image;
            let dataKey = images[i].name+"_data";
            data[dataKey] = images[i];
        }

        return data;
    }

    uploadAudio = (e) => {
        e.preventDefault();
        var audioDataToSave = this.createDataForUploading();
        console.log(audioDataToSave);
        if(audioDataToSave  === false) {
            return false;
        }

        if(Object.keys(this.thumbnail).length === 0) {
            MainNavBar__Toast('err', "Add atleast one image for the playlist");
            return false;
        }

        let formData = new FormData();
        for (let key in audioDataToSave) {
            if (typeof (audioDataToSave[key]) == 'object' && key.includes('_data')) {
                formData.append(key, JSON.stringify(audioDataToSave[key]))
            } else {
                formData.append(key, audioDataToSave[key]);
            }
        }

        for (var pair of formData.entries()) {
            console.log(pair[0]+ ', ' + pair[1]); 
        }



        if (formData) {
            utility.showLoader();
            AjaxService.postImageData(Routes.XMUSIC_UPLOAD_SONG(), formData, function(response) {
                MainNavBar__Toast('success', "Song uploaded successfully");
                setTimeout(function () { window.location.replace(Config[Config.env].url+"/xmusic/audios/") }, 500);              
            }, function(error) {
                console.log(error);
                MainNavBar__Toast('err', "Some error while saving data");
            }, {
                timeout: 10000000,
                onComplete: function () {
                    $('button#uploadAudioForm__btnUploadAudio').removeAttr('disabled');
                    $('button#uploadAudioForm__btnGoBack').removeAttr('disabled');
                    $('button#uploadAudioForm__btnUploadAudio').html('<i class="fas fa-cloud-upload-alt margin-right-10"></i> Upload ');
                },
                beforeSend: function () {
                    $('button#uploadAudioForm__btnUploadAudio').html('Uploading your playlist... it might take time.');
                    $('button#uploadAudioForm__btnUploadAudio').prepend("<span class='spinner-grow spinner-grow-sm' role='status' aria-hidden='true'></span>")
                    $('button#uploadAudioForm__btnUploadAudio').attr('disabled', 'disabled');
                    $('button#uploadAudioForm__btnGoBack').attr('disabled', 'disabled')
                }
            })
        }
    }


    render() { 
        return ( 
            <React.Fragment>
               <div className= "container-fluid margin-top-5" id="uploadAudioForm">
                    <h3>Upload Your Audio</h3>
                    <Form className="margin-top-15 margin-bottom-50" name="uploadAudioForm" id="uploadAudioForm">
                        <div className="row">
                            <div className="col col-5">
                                <XUploadAudio
                                    width="100"
                                    height="20"
                                    id="uploadAudioForm__audio"
                                    name="uploadAudioForm__audio"
                                    callBack={(audio) => this.getAudio(audio)}
                                    maxFileSize={20971520}
                                    errCallBack={(err) => this.errorAudioUploading(err)}
                                /> 
                                <Form.Group controlId="uploadAudioForm__songTitle" className="margin-top-10">
                                    <OverlayTrigger
                                        placement="right"
                                        overlay={
                                            <Tooltip>
                                                Choose the most suitable title for your audio.
                                            </Tooltip>
                                        }
                                    >
                                        <Form.Label className="text-x-default cursor-pointer">Title</Form.Label>
                                    </OverlayTrigger>
                                    <Form.Control type="text" placeholder="Audio Title" name="songTitle" maxLength="60" />
                                    <Form.Text className="text-muted">
                                        Maximun 60 characters
                                    </Form.Text>
                                </Form.Group>
                                <Form.Group controlId="uploadAudioForm__description">
                                    <OverlayTrigger
                                        placement="right"
                                        overlay={
                                            <Tooltip>
                                                Please provide a brief description about your audio.
                                            </Tooltip>
                                        }
                                    >
                                    <Form.Label className="text-x-default">Description</Form.Label>
                                    </OverlayTrigger>
                                    <Form.Control name="description" as="textarea" rows="3" />
                                </Form.Group>
                                <Form.Group controlId="uploadAudioForm__hashtags">
                                    <OverlayTrigger
                                        placement="right"
                                        overlay={
                                            <Tooltip>
                                                Choose perfect SEO Keywords for your song. This helps Xwards in pushing your song to the most relevant user.
                                            </Tooltip>
                                        }
                                    >
                                        <Form.Label className="text-x-default">SEO Keywords (don't use #) - Use 'Tab' to seperate</Form.Label>
                                    </OverlayTrigger>
                                    <Chips
                                        name="seoKeywords"
                                        value={this.state.hashtags}
                                        onChange={(e) => this.addHashtag(e)}
                                    />
                                </Form.Group>
                            </div>
                            <div className="col col-7">
                                <div className="row">
                                    <div className="col col-12">
                                        <XUploadImage
                                            id="thumbnail"
                                            name="thumbnail"
                                            width="504px" 
                                            height="282px" 
                                            class="imp-margin-bottom-15"
                                            title="Thumbnail Image"
                                            subtitle="Width X Height (504px X 282px)"
                                            maxFileSize={4194304}
                                            errCallBack={(e) => this.maxFileSize(e)}
                                            callBack={(e) => this.addImages(e, 'thumbnail')}
                                            onImage={(e) => this.onImages(e, 'thumbnail')}
                                            imageSrc={this.state.img_thumbnail}
                                        />
                                    </div>
                                    <div className = "col col-6">
                                        <XUploadImage
                                            id="big"
                                            name="big"
                                            width="315px" 
                                            height="250px"
                                            title="Big Cover Image"
                                            subtitle="Width X Height (426px X 420px)"
                                            class="imp-margin-bottom-15 imp-margin-right-5"
                                            maxFileSize={4194304}
                                            errCallBack={(e) => this.maxFileSize(e)}
                                            callBack={(e) => this.addImages(e, 'big')}
                                            onImage={(e) => this.onImages(e, 'big')}
                                            imageSrc={this.state.img_big}
                                        />
                                    </div>
                                    <div className = "col col-6">
                                        <XUploadImage
                                            id="mid"
                                            name="mid"
                                            width="315px" 
                                            height="250px"
                                            class="imp-margin-bottom-15 imp-margin-right-5"
                                            title="Mid Size Cover Image"
                                            subtitle="Width X Height (426px X 315px)"
                                            maxFileSize={4194304}
                                            errCallBack={(e) => this.maxFileSize(e)}
                                            callBack={(e) => this.addImages(e, 'mid')}
                                            onImage={(e) => this.onImages(e, 'mid')}
                                            imageSrc={this.state.img_mid}
                                        />
                                    </div>
                                </div>
                            </div>
                            <Button variant="outline-x-love" className="margin-right-10 margin-top-20" id="uploadAudioForm__btnGoBack" onClick={() => this.goBack()}>
                                <i className="fas fa-chevron-left margin-right-10"></i> Back
                            </Button>
                            <Button variant="x-dark-default" className="margin-left-5 margin-top-20" id="uploadAudioForm__btnUploadAudio" onClick={(e) => this.uploadAudio(e)}>
                                <i className="fas fa-cloud-upload-alt margin-right-10"></i>Upload Audio
                            </Button>
                        </div>
                    </Form>
                </div>
            </React.Fragment>
        );
    }
}
 
export default XMusicUploadSong;