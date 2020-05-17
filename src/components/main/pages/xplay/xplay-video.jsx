import React, { Component } from "react";
import { Button, Form } from 'react-bootstrap';
import Chips from 'react-chips';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertToRaw, ContentState } from "draft-js";
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import XUploadVideo from '../../../ui/utility/XUploadVideo';
import $ from 'jquery';
import {SideNavBar__SetActiveMenu, MainNavBar__Toast} from "../../../ui/navbar/navbar";

import {XPlayDeleteVideo, ShowDeleteVideoModal} from '../../../ui/xplay/xplay-delete-video';

import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { AjaxService,Routes } from "../../../../js/ajax/ajax";
import Config from '../../../../config';

class XPlayVideo extends Component {
    constructor(props) {
        super(props);
        SideNavBar__SetActiveMenu("/xplay");
        this.state = { videoTitle: '', chips:[], editorState:EditorState.createEmpty(), video: null, images: [] };
    }

    componentDidMount() {
        //Fetching the details from server about the video to be edited and updated
        AjaxService.get(Routes.XPLAY_VIDEO_DETAIL(this.props.match.params.channel_id,this.props.match.params.video_id), function(response) {
            var data = JSON.parse(response.data);
            let VideoFile = null;
            for (let files in data.files.video) {
                if(data.files.video[files].fieldname === 'video') {
                    VideoFile = data.files.video[files].location;
                    this.setState({ video: VideoFile });
                }
            }
            var str = data.keywords;
            var keywords = str.split(",");
            //Editor State Html
            let blocksFromHtml = htmlToDraft(data.description);
            let { contentBlocks, entityMap } = blocksFromHtml;
            let contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
            let localEditorState = EditorState.createWithContent(contentState);
            //Video Url
            for (let files in data.files) {
                if(data.files[files].fieldname === 'video') {
                    this.setState({ video: data.files[files].location})
                }
            }
            this.setState({videoTitle: data.videoTitle, chips: keywords, editorState: localEditorState });
            let width = $('#xVideoHolder').width();
            let calculatedHeight = (720*width)/1280;        
            this.setState({videoUploadWidth: width+'px', videoUploadHeight: calculatedHeight+'px'});
            $("input[type='file']#newChannelModalForm__photo").hover(function() {
                $("div#xPlay__btnUploadCoverPhoto").css('opacity', '0.85');
            }, function() {
                $("div#xPlay__btnUploadCoverPhoto").css('opacity', '0.1');
            })
        }.bind(this), function(error) {
            MainNavBar__Toast('err', "Error. Please Try Again...");
        })
    }

    // Changes in the video title
    videoTitleChange(e) {
        this.setState({ videoTitle: e.target.value });
    }

    // Changes in the hashtags
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
        this.setState({ chips: hashtags});
    }

    //Changes in desription field
    onWriting(editorState) {
        this.setState({
            editorState: editorState
        });
    }

    // Function to go back from this page
    goBack(e) { 
        e.preventDefault();
        this.props.history.push("/xplay/channel/"+ this.props.match.params.channel_id)
    }   

    // Updating the details of the video after editing
    updateVideoDetails = (e) => {
        e.preventDefault();
        if(this.state.videoTitle === null || this.state.videoTitle === undefined) {
            MainNavBar__Toast('err', "Error. Title must be between 10 to 60 characters.");
            return false;
        }
        let videoTitle = this.state.videoTitle.trim().replace(/\s\s+/g, ' ');
        if (videoTitle.length < 10 && videoTitle.length < 61) {
            MainNavBar__Toast('err', "Error. Title must be between 10 to 60 characters.");
            return false;
        }
        if (this.state.chips.length < 4) {
            MainNavBar__Toast('err', "Error. You must have atleast 4 keywords.");
            return false;
        }

        let editorContent = this.state.editorState;
        let htmlContent = draftToHtml(convertToRaw(editorContent.getCurrentContent())); //Convert editor content data into HTML
        let chips = this.state.chips;
        let keywords = chips.toString();
        let videoUpdateDetails = {
            videoTitle: this.state.videoTitle,
            keywords: keywords,
            description: htmlContent
        }
        // Route to update the details of the video
        AjaxService.put(Routes.XPLAY_UPDATE_VIDEO_DETAILS(this.props.match.params.channel_id, this.props.match.params.video_id), videoUpdateDetails, function(response){
            window.location.replace(Config[Config.env].url + "/xplay/channel/" +response.channel_id);
            MainNavBar__Toast('success', "Updated your changes successfully");
        }, function(error){
            MainNavBar__Toast('err', "Error. Please Try Again...");
        })
    }

	render() {
		return (
			<div className="container-fluid">
				<div className="row margin-top-30">
                    <div className="col col-8" id="xVideoHolder">
                        <XUploadVideo
                            videoSrc={this.state.video}
                            width={this.state.videoUploadWidth}
                            height={this.state.videoUploadHeight}
                            allowUpload={false}
                        /> 
                    </div> 
                    <div className="col col-4 right">
                        <Button variant="danger" id="btnDeleteVideo" sm="4" className="right margin-left-5" onClick={()=>ShowDeleteVideoModal()}>
                            Delete Video
                        </Button>
                    </div>
                    <div className="col col-8  margin-top-20 margin-bottom-20">   
                        <Form name="updateVideoDetailsForm" id="updateVideoDetailsForm">
                            <Form.Group>
                                <Form.Label>Title</Form.Label>
                                <Form.Control name="videoTitle" type="text"
                                    value={this.state.videoTitle} onChange={(e) => this.videoTitleChange(e)} maxLength="60"/>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Description</Form.Label>
                                <Editor
                                    toolbarHidden
                                    editorState={this.state.editorState}
                                    toolbarClassName="x-toolbar"
                                    wrapperClassName="editor-wrapper"
                                    editorClassName="editing-preview-area"
                                    onEditorStateChange={(e) => this.onWriting(e)}
                                    editorStyle={{minHeight: '300px'}}
                                    value={this.state.editorState}
                                />
                            </Form.Group>        
                            <Form.Group>
                                <Form.Label>Tags</Form.Label>
                                <div>
                                <Chips
                                    value={this.state.chips}
                                    onChange={(e)=> this.addHashtag(e)}
                                />
                                </div>
                            </Form.Group>
                            
                            <Button variant="x-dark-default" type="submit" id="updateVideoDetailsForm__btnUpdateVideoDetails" 
                                sm="4" className="right margin-left-5" onClick={(e)=>this.updateVideoDetails(e)}>
                                Update Details 
                            </Button>
                            <Button variant="outline-x-love" onClick={(e) => this.goBack(e)} className="margin-right-10">
                                <i className="fas fa-chevron-left margin-right-10"></i> Go Back 
                            </Button>
                        </Form>
                    </div>
				</div>

                <XPlayDeleteVideo 
                    videoId={this.props.match.params.video_id}
                    channelId= {this.props.match.params.channel_id}
                />
			</div>
		);
	}
}

export default XPlayVideo;

