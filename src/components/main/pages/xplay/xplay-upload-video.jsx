import React, { Component } from "react";
import {OverlayTrigger, Tooltip, Button, Form, Modal} from 'react-bootstrap';
import Chips from 'react-chips';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertToRaw } from "draft-js";
import draftToHtml from 'draftjs-to-html';
import {AjaxService, Routes} from "../../../../js/ajax/ajax";
import XUploadImage from "../../../ui/utility/XUploadImage";
import utility from '../../../../js/lib/utility';
import $ from 'jquery';
import XUploadVideo from '../../../ui/utility/XUploadVideo';
import Config from '../../../../config';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import {SideNavBar__SetActiveMenu, MainNavBar__Toast} from "../../../ui/navbar/navbar";
import XplayDataService from '../../../../js/services/xplayDataService';

var addThumbnailImageShowModal = function () {
    this.setState({ show: true });
}

class XPlayUploadVideo extends Component {
    constructor(props) {
        super(props);
        addThumbnailImageShowModal = addThumbnailImageShowModal.bind(this);
        this.state = {
            hashtags: [],
            editorState: EditorState.createEmpty(),
            video: null,
            show: false,
            img_full: null,
            img_mid: null,
            img_large: null,
            img_big: null,
        }
        this.thumbnail = {};
        SideNavBar__SetActiveMenu("/xplay");
    }
    
    // Function to hide the image modal
    hideModal() {
        this.setState({ show: false });
    }

    //Function to add image and convert it to blob format from image format
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
                XplayDataService.addImage(name, blob);
            }
        }
    }

    //assigning the name of images
    onImages(e, name) {
        let stateObj = {};
        stateObj['img_'+name] = e;
        this.setState(stateObj);
    }

    //open the modal for uploading images
    openModal(e) {
        e.preventDefault();
        this.setState({show: true });
    }

    componentDidMount() {
        let width = $('#xVideoHolder').width();
        let calculatedHeight = (720*width)/1280;        
        this.setState({videoUploadWidth: width+'px', videoUploadHeight: calculatedHeight+'px'});
        $("input[type='file']#newChannelModalForm__photo").hover(function() {
            $("div#xPlay__btnUploadCoverPhoto").css('opacity', '0.85');
        }, function() {
            $("div#xPlay__btnUploadCoverPhoto").css('opacity', '0.1');
        })
    }

    //Function to go back from the uploading video page
    goBack(e) {
        e.preventDefault();
        var channel_id = this.props.match.params.channel_id;
        this.props.history.push("/xplay/channel/" + channel_id);
    }

    //Function to add hashtag and adding validation to the hasshtag fields
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
        this.setState({hashtags: hashtags});
    }

    // Function to write the description about the video
    onWriting(editorState) {
        this.setState({editorState: editorState});
    }

    //Validating the file size
    maxFileSize(e){
        MainNavBar__Toast('err', "File is too big to upload.");
    }

    //Getting the video and setting to state
    getVideo(video) {
        this.setState({video: video});
    }

    //Validating the file size of video and returning the error
    errorVideoUploading(err) {
        switch(err) {
            case 'MAX_FILE_SIZE':
                MainNavBar__Toast('err', "File is too big to upload.");
                break;
            default:
                break;
        }
    }

    //Saving Content As Draft -> Details about the video
    createDataForUploading() {
        
        let videoTitle = $('#uploadVideoForm__videoTitle').val();

        if (videoTitle === null || videoTitle === undefined) {
            MainNavBar__Toast('err', "Error. Title must be between 10 to 60 characters.");
            return false;
        }
        
        videoTitle = videoTitle.trim().replace(/\s\s+/g, ' ');
        if (videoTitle.length < 10 && videoTitle.length < 61) {
            MainNavBar__Toast('err', "Error. Title must be between 10 to 60 characters.");
            return false;
        }
        if (this.state.hashtags.length < 4) {
            MainNavBar__Toast('err', "Error. You must have atleast 4 keywords.");
            return false;
        }

        if (this.state.video === null) {
            MainNavBar__Toast('err', "Error. You must upload video");
            return false;
        }

        let editorContent = this.state.editorState; //Read editor Content data
        let htmlContent = draftToHtml(convertToRaw(editorContent.getCurrentContent())); //Convert editor content data into HTML

        let data = {
            videoTitle: videoTitle,
            description: htmlContent,
            keywords: this.state.hashtags,
            video: this.state.video
        }

        let images = XplayDataService.getNonNullImages();
        for (let i in images) {
            data[images[i].name] = images[i].image;
            delete images[i].image;
            let dataKey = images[i].name+"_data";
            data[dataKey] = images[i];
        }

        return data;
    }

    // Uploading the video details to the server
    submitVideo(e) {
        e.preventDefault();
        var videoDataToSave = this.createDataForUploading();
        if (videoDataToSave === false) {
            return false;
        }
        if(Object.keys(this.thumbnail).length === 0) {
            MainNavBar__Toast('err', "Add atleast one thumbnail image for the video");
            return false;
        }
        let formData = new FormData();
        for (let key in videoDataToSave) {
            if (typeof (videoDataToSave[key]) == 'object' && key.includes('_data')) {
                formData.append(key, JSON.stringify(videoDataToSave[key]))
            } else {
                formData.append(key, videoDataToSave[key]);
            }
        }

        if (formData) {
            utility.showLoader();
            AjaxService.postImageData(Routes.XPLAY_UPLOAD_VIDEO(this.props.match.params.channel_id), formData, function(response) {
                var channel_id = response;
                MainNavBar__Toast('success', "Successfully Created");
                setTimeout(function () { window.location.replace(Config[Config.env].url+"/xplay/channel/"+channel_id) }, 500);
            }, function(error) {
                MainNavBar__Toast('err', "Some error while saving data");
            },{
                timeout: 10000000,
                onComplete: function () {
                    $('button#uploadVideoForm__btnUploadVideo').removeAttr('disabled');
                    $('button#uploadVideoForm__backBtn').removeAttr('disabled');
                    $('button#uploadVideoForm__btnUploadVideo').html('<i class="fas fa-cloud-upload-alt margin-right-10"></i> Upload ');
                },
                beforeSend: function () {
                    $('button#uploadVideoForm__btnUploadVideo').html('Uploading your video... it might take time.');
                    $('button#uploadVideoForm__btnUploadVideo').prepend("<span class='spinner-grow spinner-grow-sm' role='status' aria-hidden='true'></span>")
                    $('button#uploadVideoForm__btnUploadVideo').attr('disabled', 'disabled');
                    $('button#uploadVideoForm__backBtn').attr('disabled', 'disabled')
                }
            });
        }
    }

	render() {
        const { editorState } = this.state;
		return (
			<div className="container-fluid">
                <div className="row margin-top-5 margin-bottom-30">
                    <div className="col col-6">
                        <h4 className="montserrat-light margin-bottom-20">Upload a New Video</h4>
                        <Form name="uploadVideoForm" id="uploadVideoForm" className="row" onSubmit={this.uploadVideo}>
                            <Form.Group className="col col-12" controlId="uploadVideoForm__videoTitle">
                                <OverlayTrigger
                                    placement="right"
                                    overlay={
                                        <Tooltip>
                                            Your video must have a title. 
                                        </Tooltip>
                                    }
                                >
                                    <Form.Label className="text-x-default margin-left-5">Video Title</Form.Label>
                                </OverlayTrigger>
                                <Form.Control name="videoTitle" type="text" placeholder="Title" maxLength="60" />
                            </Form.Group>
                            <Form.Group className="col col-12" controlId="uploadVideoForm__seoKeywords">
                                <OverlayTrigger
                                    placement="right"
                                    overlay={
                                        <Tooltip>
                                            Choose perfect SEO Keywords for your content. This helps Xwards in pushing your content to the most relevant reader.
                                        </Tooltip>
                                    }
                                >
                                    <Form.Label className="text-x-default margin-left-5">SEO Keywords (don't use #) - Use 'Tab' to seperate</Form.Label>
                                </OverlayTrigger>
                                <Chips
                                    name="seoKeywords"
                                    value={this.state.hashtags}
                                    onChange={(e) => this.addHashtag(e)}
                                />
                            </Form.Group>
                            <Form.Group className="col col-12" controlId="uploadVideoForm__videDescription">
                                <OverlayTrigger
                                    placement="right"
                                    overlay={
                                        <Tooltip>
                                            Provide a short description about the video
                                        </Tooltip>
                                    }
                                >
                                    <Form.Label className="text-x-default margin-left-5">Description</Form.Label>
                                </OverlayTrigger>
                                <Editor
                                    name="videDescription"
                                    editorState={editorState}
                                    toolbarHidden
                                    wrapperClassName="editor-wrapper"
                                    editorClassName="editing-preview-area"
                                    onEditorStateChange={(e) => this.onWriting(e)}
                                    editorStyle={{minHeight: '300px'}}
                                />
                            </Form.Group>
                            <div className="col col-12 form-group">
                                <button className="btn btn-link text-x-upload" onClick={(e) => this.openModal(e)}>Upload Thumbnail Images</button>
                            </div>
                            <div className="col col-12 form-group">
                                <Button variant="outline-x-love" id="uploadVideoForm__backBtn" onClick={(e) => this.goBack(e)} className="margin-right-10">
                                    <i className="fas fa-chevron-left margin-right-10"></i> Go Back 
                                </Button>
                                <Button variant="x-default" type="submit" id="uploadVideoForm__btnUploadVideo" onClick={(e) => this.submitVideo(e)}>
                                    <i className="fas fa-cloud-upload-alt margin-right-10"></i> Upload 
                                </Button>
                            </div>
                        </Form>
                    </div>
                    <div className="col col-6" id="xVideoHolder">
                        <XUploadVideo
                            width={this.state.videoUploadWidth}
                            height={this.state.videoUploadHeight}
                            title="Upload Video"
                            subtitle="Max 360dp MP4 Video Format (Max File Size: 400MB)"
                            id="uploadVideoForm__video"
                            name="uploadVideoForm__video"
                            callBack={(video) => this.getVideo(video)}
                            maxFileSize={419430400}
                            errCallBack={(err) => this.errorVideoUploading(err)}
                        /> 
                    </div>
                </div>
                <Modal show={this.state.show} id="Xplay-ThumbnailImage" centered={false} onHide={() => this.hideModal()}>
                    <Form.Group>
                        <Modal.Header closeButton={true}>
                            <OverlayTrigger
                                placement="right"
                            overlay={
                                <Tooltip>
                                    Upload different size thumbnail images for the corresponding video
                                </Tooltip>
                            }
                            >
                            <Form.Label className="text-x-default cursor-pointer">Upload Images of Different Sizes</Form.Label>
                            </OverlayTrigger>
                        </Modal.Header>
                    </Form.Group>
                    <Modal.Body className="padding-top-0">
                        <div className="row"> 
                            <div className="col col-6 form-group">
                                <XUploadImage
                                    id="big"
                                    name="big"
                                    width="426px" 
                                    height="460px"
                                    title="Big Cover Image"
                                    subtitle="Width X Height (426px X 460px)"
                                    class="imp-margin-bottom-15"
                                    maxFileSize={4194304}
                                    errCallBack={(e) => this.maxFileSize(e)}
                                    callBack={(e) => this.addImages(e, 'big')}
                                    onImage={(e) => this.onImages(e, 'big')}
                                    imageSrc={this.state.img_big}
                                />
                            </div>
                            <div className="col col-6 form-group">
                                <XUploadImage
                                    id="mid"
                                    name="mid"
                                    width="426px" 
                                    height="345px"
                                    title="Mid Size Cover Image"
                                    subtitle="Width X Height (426px X 345px)"
                                    maxFileSize={4194304}
                                    errCallBack={(e) => this.maxFileSize(e)}
                                    callBack={(e) => this.addImages(e, 'mid')}
                                    onImage={(e) => this.onImages(e, 'mid')}
                                    imageSrc={this.state.img_mid}
                                />
                            </div> 
                            <div className="col col-12">
                                <XUploadImage
                                    id="thumbnail"
                                    name="thumbnail"
                                    width="504px" 
                                    height="282px"
                                    title="Thumbnail Size Cover Image"
                                    subtitle="Width X Height (504px X 282px)"
                                    maxFileSize={4194304}
                                    errCallBack={(e) => this.maxFileSize(e)}
                                    callBack={(e) => this.addImages(e, 'thumbnail')}
                                    onImage={(e) => this.onImages(e, 'thumbnail')}
                                    imageSrc={this.state.img_thumbnail}
                                />
                            </div>   
                        </div>
                        <Button variant="x-default  margin-top-20" className="right margin-right-5" onClick={() => this.hideModal()}>
                            Done
                        </Button>
                    </Modal.Body>
                </Modal>
			</div>
		);
	}
}

export default XPlayUploadVideo;

