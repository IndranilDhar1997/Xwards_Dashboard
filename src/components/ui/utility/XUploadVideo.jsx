import React, { Component } from "react";
import ReactPlayer from 'react-player';
import {Button} from 'react-bootstrap';
import utility from '../../../js/lib/utility';
import $ from 'jquery';

class XUploadVideo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            //videoSrc: props.videoSrc
            videoSrc: null,
            playPause: false,
            playerTime: 0,
            videoDuration: 0,
            videoLapseTime: 0,
            toolbar: true,
            upload: true
        };
    }

    componentWillReceiveProps(nextProps) {
        // You don't have to do this check first, but it can help prevent an unneeded render
        if ((nextProps.videoSrc !== this.state.videoSrc) && !('onFileUpload' in this.state)) {
            this.setState({ videoSrc: nextProps.videoSrc });
        }
    }

    componentDidMount() {
        let toolbar = true;
        let upload = true;
        let videoSrc = null;
        if ("allowUpload" in this.props) {
            upload = this.props.upload;
        }
        if ("toolbar" in this.props) {
            toolbar = this.props.toolbar;
        }
        if ("videoSrc" in this.props) {
            videoSrc = this.props.videoSrc;
        }
    
        $("input[type='file']#"+this.props.id).hover(function() {
            $("div#"+this.props.id+"__changeVideoBtn").css('opacity', '0.85');
        }.bind(this), function() {
            $("div#"+this.props.id+"__changeVideoBtn").css('opacity', '0.1');
        }.bind(this));

        this.setState({upload: upload, toolbar: toolbar, videoSrc: videoSrc});
    }

    bindRef(player) {
        this.player = player;
        if ("Xref" in this.props) {
            this.props.Xref(player);
        }
    }

    playVideo(e) {
        e.preventDefault();
        this.setState({playPause: !this.state.playPause});
    }
    stopVideo(e) {
        e.preventDefault();
        this.setState({playPause: false});
        this.player.seekTo(0);
    }
    seekPlayer(e) {
        this.player.seekTo(parseFloat(e.target.value))
    }
    playerOnProgress(e) {
        this.setState({playerTime: parseFloat(e.played)});
        this.setState({videoLapseTime: parseFloat(e.playedSeconds)});
    }
    onDurationLoad(duration) {
        this.setState({videoDuration: duration});
    }

    onFileUpload (event) {
        if (event.target.files[0]) {
            let file = event.target.files[0];
            let fileReader = new FileReader();
            fileReader.onload = function() {
                let blob = new Blob([fileReader.result], {type: file.type});
                let url = URL.createObjectURL(blob);
                this.setState({ videoSrc: url, onFileUpload: true });
                if ("callBack" in this.props) {
                    this.props.callBack(blob);
                }
            }.bind(this);
            if (file.size <= this.props.maxFileSize) {
                fileReader.readAsArrayBuffer(file);
            } else {
                if ("errCallBack" in this.props) {
                    this.props.errCallBack("MAX_FILE_SIZE");
                }
            }
        }
    }

    render() {
        return (
            <React.Fragment>
                <div className={'x-video-upload ' + this.props.class} style={{height:this.props.height, width:this.props.width}} id={this.props.id + "__holder"}>
                    {typeof this.state.videoSrc === 'undefined' && <button className={"x-video-upload-title btn " + this.props.titleClass} style={{height:this.props.height, width:this.props.width}}>
                            <h1 className=""><i className="fas fa-upload"></i></h1>
                            <div className="">{this.props.title}</div>
                            <div className="text-xs">{this.props.subtitle}</div>
                        </button>
                    }
                    
                    <input 
                        type="file" 
                        disabled={(typeof this.state.videoSrc === 'undefined') ? false : (this.state.upload ? false : true)}
                        accept="video/mp4,video/x-m4v,video/mkv,video/wmv" 
                        id={this.props.id} 
                        name={this.props.name} 
                        className={'x-video-upload-file'} 
                        style={{height:this.props.height, width:this.props.width}} 
                        onChange={(e) => this.onFileUpload(e)}
                    />
                    {(typeof this.state.videoSrc !== 'undefined') &&
                        <React.Fragment>
                            <ReactPlayer 
                                onProgress={(e) => this.playerOnProgress(e)} 
                                ref={(player) => this.bindRef(player)} 
                                url={this.state.videoSrc} 
                                height={this.props.height}
                                width={this.props.width} 
                                volume={1} 
                                playing={this.state.playPause}
                                onDuration={(duration) => this.onDurationLoad(duration)}
                            />
                            {this.state.toolbar &&
                                <React.Fragment>
                                    <input onChange={(e) => this.seekPlayer(e)} type='range' value={this.state.playerTime} min='0' step="0.01" max="1" className="width-100 cursor-pointer" />
                                    {(typeof this.state.videoSrc !== 'undefined' && this.state.upload) ?
                                        <div className="right btn btn-x-default cursor-pointer" id={this.props.id+"__changeVideoBtn"} style={{
                                            position: "absolute",
                                            top: "50%",
                                            marginTop: "-19px",
                                            left: "50%",
                                            width: "300px",
                                            marginLeft: "-150px",
                                            opacity: "0.1"
                                        }}
                                            >
                                            Click to replace this video
                                        </div>
                                        :
                                        null
                                    }
                                    <div className="display-inline">
                                        <Button onClick={(e)=>this.playVideo(e)} variant="success" className="margin-right-10 btn-sm" id={this.props.id+"__tool__playBtn"}>
                                            <i className="fas fa-play margin-right-10"></i> <i className="fas fa-pause"></i>
                                        </Button>
                                        <Button onClick={(e)=>this.stopVideo(e)} variant="danger" className="margin-right-10 btn-sm" id={this.props.id+"__tool__pauseBtn"}>
                                            <i className="fas fa-stop"></i>
                                        </Button>
                                    </div>
                                    <div className="display-inline right text-sm text-secondary margin-top-5">
                                        {utility.secondsToHms(this.state.videoLapseTime) !== '' &&
                                            utility.secondsToHms(this.state.videoLapseTime)+" /"
                                        }
                                        &nbsp;{utility.secondsToHms(this.state.videoDuration)}
                                    </div>
                                </React.Fragment>
                            }
                        </React.Fragment>
                    }
                </div>
            </React.Fragment>
        )
    }
}

export default XUploadVideo;
