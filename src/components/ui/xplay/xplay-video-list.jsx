import React, {Component} from 'react';
import {Card} from "react-bootstrap";
import {AjaxService, Routes} from '../../../js/ajax/ajax';
import {MainNavBar__Toast} from '../navbar/navbar';
import Pagination from "react-js-pagination";
import XUploadVideo from "../../ui/utility/XUploadVideo";
import $ from 'jquery';
import utility from '../../../js/lib/utility';

class XPlayVideoList extends Component {

    constructor (props) {
        super(props);
        this.state = { videoList: [], activePage: 1,  totalItemsCount: '', videoUploadWidth: '', videoUploadHeight:''}
        this.player = {};
    }

    // Player to display the static video with some seconds forwarded
    bindPlayer(player, id) {
        this.player['player'+id] = player;
        if (player) {
            player.seekTo(0.3);
        }
    }

    componentDidMount() {
        // Fetching details of the in-review as well as live videos with video type and video id
        let videoListType = this.props.type;
        let videoListChannelId = this.props.channelId;
        AjaxService.get(Routes.XPLAY_GET_CHANNEL_VIDEOS(videoListChannelId, videoListType), function(response) {
            this.setState({ videoList: response.videos, totalItemsCount: response.count});
        }.bind(this), function(error) {
            MainNavBar__Toast('err', "Some Error in Fetching Informations")
        });
        let width = $('div.videoListContainer:first').width();
        
        let calculatedHeight = (720*width)/1280;
        this.setState({videoUploadWidth: width+'px', videoUploadHeight: calculatedHeight+'px'});
    }

    // Handling the pagination for the video list page
    handlePageChange(pageNumber) {
        let videoListType = this.props.type;
        let videoListChannelId = this.props.channelId;
        this.setState({activePage: pageNumber});
        AjaxService.get(Routes.XPLAY_GET_CHANNEL_VIDEOS(videoListChannelId, videoListType)+"?page="+pageNumber, function(response) {
            this.setState({videoList: response.videos, totalItemsCount: response.count});
        }.bind(this), function(error) {
            MainNavBar__Toast('err', 'Some error happened while fetching details');
        })
    }

    render () {
        return (
            <React.Fragment>
                <div className="padding-bottom-10">
                    {this.state.videoList.length <= 0 && 
                        <Card className="text-center margin-top-10">
                            <Card.Body>
                                <h5 className="text-secondary">No videos uploaded on this channel</h5>
                            </Card.Body>
                        </Card>
                    }
                    {this.state.videoList.map(video =>(
                        <div key={video.id} className="row margin-top-10">
                            <div className="col col-4 videoListContainer" id={"videoList__video__container"+video.id}>
                                <XUploadVideo
                                    width={this.state.videoUploadWidth}
                                    height={this.state.videoUploadHeight}
                                    id={"videoList__video"+video.id}
                                    name={"videoList__video"+video.id}
                                    videoSrc={video.url}
                                    allowUpload={false}
                                    toolbar={false}
                                    Xref={(player) => this.bindPlayer(player, video.id)}
                                />
                            </div>
                            <div className="col col-8">
                                { this.props.type === 'review' && (
                                    <h4 className="text-x-default">
                                        <a href={`${this.props.channelId}/video/${video.id}`}>{video.title}</a>
                                    </h4>
                                )}
                                { this.props.type === 'live' && (
                                    <a href={`${this.props.channelId}/live-video/${video.neo_id}`}>{video.title}</a>
                                )}
                                <p className="text-black" style={{overflow: 'hidden', maxHeight: this.state.videoUploadHeight }} dangerouslySetInnerHTML={{  __html: `${video.description}` }}></p>
                                <div className="left-align text-sm italic text-secondary">Last Updated: {utility.toDateFormat(video.updated_at)}</div>
                            </div>
                        </div>
                    ))}
                </div>
                {this.state.videoList.length > 0 && 
                    <div className="padding-bottom-50">
                        <Pagination
                            activePage={this.state.activePage}
                            itemsCountPerPage={10}
                            totalItemsCount={this.state.totalItemsCount}
                            pageRangeDisplayed={5}
                            itemClass="page-item"
                            linkClass="page-link"
                            onChange={(e) => this.handlePageChange(e)}
                        />
                    </div>
                }
            </React.Fragment>
        )
    }
}


export default XPlayVideoList