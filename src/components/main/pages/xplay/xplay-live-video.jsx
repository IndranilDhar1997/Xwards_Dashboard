import React, { Component } from 'react';
import { AjaxService, Routes } from '../../../../js/ajax/ajax';
import XUploadVideo from '../../../ui/utility/XUploadVideo';
import $ from 'jquery';
import {ListGroup} from 'react-bootstrap';
import {SideNavBar__SetActiveMenu, MainNavBar__Toast} from "../../../ui/navbar/navbar";


class XPlayLiveVideo extends Component {
    constructor(props) {
        super(props);
        SideNavBar__SetActiveMenu('/xplay');
        this.state = {
            videoTitle: '',
            keywords: [],
            description: '',
            video: null,
            images: [],
            impressions: null
        }
    }

    componentDidMount() {
        //Fetching the live video details by id
        AjaxService.get(Routes.XPLAY_GET_LIVE_VIDEO_BY_ID(this.props.match.params.video_id), function(response) {
            console.log(response);
            this.setState({
                videoTitle: response.videoTitle,
                keywords: response.keywords.split(','),
                description: response.description,
                images: response.images,
                video: response.videoUrl,
                impressions: response.impressions
            })
            let width = $('#xVideoHolder').width();
            let calculatedHeight = (720*width)/1280;        
            this.setState({videoUploadWidth: width+'px', videoUploadHeight: calculatedHeight+'px'});
            $("input[type='file']#newChannelModalForm__photo").hover(function() {
                $("div#xPlay__btnUploadCoverPhoto").css('opacity', '0.85');
            }, function() {
                $("div#xPlay__btnUploadCoverPhoto").css('opacity', '0.1');
            })
        }.bind(this), function(error) {
            MainNavBar__Toast('err', "Error in Fetching Details for Live Video");
        })
    }

    render() { 
        return ( 
            <React.Fragment>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col col-8 margin-top-20">
                            {/* Live Video details with video file */}
                            <div className="row">
                                <div className="col col-12" id="xVideoHolder">
                                    <XUploadVideo
                                        videoSrc={this.state.video}
                                        width={this.state.videoUploadWidth}
                                        height={this.state.videoUploadHeight}
                                        allowUpload={false}
                                    /> 
                                </div>
                                <div className="col col-8 margin-top-30">
                                    <h5 className="text-x-default">{this.state.videoTitle}</h5>
                                </div>
                                <div className="col col-4 margin-top-30">
                                    <p className="text-x-default">Impressions:  {this.state.impressions}</p>
                                </div>
                                <div className="col col-12 margin-top-10">
                                    <div dangerouslySetInnerHTML={{  __html: `${this.state.description}` }} />
                                </div>
                                <div className="col col-12 margin-bottom-50 max-width-100">
                                    {this.state.keywords.map(keyword => (
                                        <span key={keyword} className="text-sm badge badge-pill badge-secondary margin-right-10 montserrat-light">{keyword}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="col col-4">
                            {/* Live Videos Images */}
                            <ListGroup variant="flush">
                                { this.state.images.map(file => (
                                    <ListGroup.Item key={file.name}>
                                        <img src={file.img_url} className="margin-10" style={{width: '250px', height: "100px"}}></img>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}
 
export default XPlayLiveVideo;