import React, { Component } from "react";
import ReactPlayer from 'react-player';
import {Button} from 'react-bootstrap';
import utility from '../../../js/lib/utility';
import $ from 'jquery';

class XUploadAudio extends Component {
    constructor(props) {
        super(props);
        this.state = {
            //videoSrc: props.videoSrc
            audioSrc: null,
            playPause: false,
            playerTime: 0,
            audioDuration: 0,
            audioLapseTime: 0,
            toolbar: true,
            upload: true
        };
    }

    componentWillReceiveProps(nextProps) {
        // You don't have to do this check first, but it can help prevent an unneeded render
        if ((nextProps.audioSrc !== this.state.audioSrc) && !('onFileUpload' in this.state)) {
            this.setState({ audioSrc: nextProps.audioSrc });
        }
    }

    componentDidMount() {
        let toolbar = true;
        let upload = true;
        let audioSrc = null;
        if ("allowUpload" in this.props) {
            upload = this.props.upload;
        }
        if ("toolbar" in this.props) {
            toolbar = this.props.toolbar;
        }
        if ("audioSrc" in this.props) {
            audioSrc = this.props.audioSrc;
        }
    
        // $("input[type='file']#"+this.props.id).hover(function() {
        //     $("div#"+this.props.id+"__changeAudioBtn").css('opacity', '0.85');
        // }.bind(this), function() {
        //     $("div#"+this.props.id+"__changeAudioBtn").css('opacity', '0.1');
        // }.bind(this));

        this.setState({upload: upload, toolbar: toolbar, audioSrc: audioSrc});
    }

    bindRef(player) {
        this.player = player;
        if ("Xref" in this.props) {
            this.props.Xref(player);
        }
    }

    playAudio(e) {
        e.preventDefault();
        this.setState({playPause: !this.state.playPause});
    }
    stopAudio(e) {
        e.preventDefault();
        this.setState({playPause: false});
        this.player.seekTo(0);
    }
    seekPlayer(e) {
        this.player.seekTo(parseFloat(e.target.value))
    }
    playerOnProgress(e) {
        this.setState({playerTime: parseFloat(e.played)});
        this.setState({audioLapseTime: parseFloat(e.playedSeconds)});
    }
    onDurationLoad(duration) {
        this.setState({audioDuration: duration});
    }

    onFileUpload (event) {
        if (event.target.files[0]) {
            let file = event.target.files[0];
            let fileReader = new FileReader();
            fileReader.onload = function() {
                let blob = new Blob([fileReader.result], {type: file.type});
                let url = URL.createObjectURL(blob);
                this.setState({ audioSrc: url, onFileUpload: true });
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
                <div className={'x-audio-upload ' + this.props.class} style={{height:"20", width:"100"}} id={this.props.id + "__holder"}>
                    {typeof this.state.audioSrc === 'undefined' && <button className={"x-audio-upload-title btn " + this.props.titleClass} style={{height:this.props.height, width:this.props.width}}>
                            {/* <h1 className=""><i className="fas fa-upload"></i></h1> */}
                            <div className="">{this.props.title}</div>
                            <div className="text-xs">{this.props.subtitle}</div>
                        </button>
                    }
                    
                    <input 
                        type="file" 
                        disabled={(typeof this.state.audioSrc === 'undefined') ? false : (this.state.upload ? false : true)}
                        accept="audio/mp3" 
                        id={this.props.id} 
                        name={this.props.name} 
                        className={'x-audio-upload-file'} 
                        style={{height:"20", width:"100"}} 
                        onChange={(e) => this.onFileUpload(e)}
                    />
                    {(typeof this.state.audioSrc !== 'undefined') &&
                        <React.Fragment>
                            <ReactPlayer 
                                onProgress={(e) => this.playerOnProgress(e)} 
                                ref={(player) => this.bindRef(player)} 
                                url={this.state.audioSrc} 
                                height="20"
                                width="100" 
                                volume={1} 
                                playing={this.state.playPause}
                                onDuration={(duration) => this.onDurationLoad(duration)}
                            />
                            {this.state.toolbar &&
                                <React.Fragment>
                                    <input onChange={(e) => this.seekPlayer(e)} type='range' value={this.state.playerTime} min='0' step="0.01" max="1" className="width-100 cursor-pointer margin-top-20" />
                                    {/* {(typeof this.state.audioSrc !== 'undefined' && this.state.upload) ?
                                        <div className="right btn btn-x-default cursor-pointer" id={this.props.id+"__changeAudioBtn"} style={{
                                            position: "absolute",
                                            top: "50%",
                                            marginTop: "-19px",
                                            left: "50%",
                                            width: "300px",
                                            marginLeft: "-150px",
                                            opacity: "0.1"
                                        }}
                                            >
                                            Click to replace this Audio
                                        </div>
                                        :
                                        null
                                    } */}
                                    <div className="display-inline">
                                        <Button onClick={(e)=>this.playAudio(e)} variant="success" className="margin-right-10 btn-sm" id={this.props.id+"__tool__playBtn"}>
                                            <i className="fas fa-play margin-right-10"></i> <i className="fas fa-pause"></i>
                                        </Button>
                                        <Button onClick={(e)=>this.stopAudio(e)} variant="danger" className="margin-right-10 btn-sm" id={this.props.id+"__tool__pauseBtn"}>
                                            <i className="fas fa-stop"></i>
                                        </Button>
                                    </div>
                                    <div className="display-inline right text-sm text-secondary margin-top-5">
                                        {utility.secondsToHms(this.state.audioLapseTime) !== '' &&
                                            utility.secondsToHms(this.state.audioLapseTime)+" /"
                                        }
                                        &nbsp;{utility.secondsToHms(this.state.audioDuration)}
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

export default XUploadAudio;
