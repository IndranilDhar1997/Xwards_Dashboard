import React, {Component} from 'react';
import { Card } from "react-bootstrap";
import {AjaxService, Routes} from '../../../js/ajax/ajax';
import {MainNavBar__Toast} from '../navbar/navbar';
import Pagination from "react-js-pagination";
import utility from '../../../js/lib/utility';
import ReactAudioPlayer from 'react-audio-player';
import {XMusicDeleteAudio, ShowDeleteAudioModal} from '../../ui/xmusic/xmusic-delete-audio';
import {XMusicEditAudio, ShowEditAudioModal } from '../../ui/xmusic/xmusic-edit-audio';

class XMusicAudioList extends Component {

    constructor (props) {
        super(props);
        this.state = { audioList: [], activePage: 1,  totalItemsCount: ''}
    }

    componentDidMount() {
        let audioListType = this.props.type;
        AjaxService.get(Routes.XMUSIC_GET_AUDIOS(audioListType), function(response) {
            console.log(response);
            this.setState({ audioList: response.music, totalItemsCount: response.count});
        }.bind(this), function(error) {
            console.log(error);
            MainNavBar__Toast('err', "Some Error in Fetching Informations")
        });
    }

    handlePageChange(pageNumber) {
        this.setState({activePage: pageNumber});
        AjaxService.get(Routes.XMUSIC_GET_AUDIOS()+"?page="+pageNumber, function(response) {
            this.setState({audioList: response.music, totalItemsCount: response.count});
        }.bind(this), function(error) {
            MainNavBar__Toast('err', 'Some error happened while fetching details');
        })
    }

    render () {
        return (
            <React.Fragment>
                <div className="padding-bottom-10">
                    {this.state.audioList.length <= 0 && 
                        <Card className="text-center margin-top-10">
                            <Card.Body>
                                <h5 className="text-secondary">No audios uploaded on X-Music</h5>
                            </Card.Body>
                        </Card>
                    }
                    {this.state.audioList.map(audio =>(
                        <div key={audio.id} className="row margin-top-10">
                            <div className="col col-12">
                                { this.props.type === 'review' && (
                                    <div className="row">
                                        <div className="col col-4">
                                            <img src = {audio.photo_url} width="300" height="200" />
                                        </div>
                                        <div className = "col col-6">
                                            <h5> {audio.title} </h5>
                                            <p className="text-black" style={{overflow: 'hidden', maxHeight: '50' }}> {audio.description}</p>
                                            <div className="left-align text-sm italic text-secondary margin-bottom-20">Last Updated: {utility.toDateFormat(audio.updated_at)}</div>
                                            <ReactAudioPlayer
                                                src={audio.url}
                                                controls
                                            />
                                        </div>
                                        <div className="col col-2 right-align">
                                            <button className="btn btn-info btn-sm margin-right-5" onClick={()=> ShowEditAudioModal(audio.id)}>Edit</button>
                                            <button className="btn btn-danger btn-sm" onClick={()=>ShowDeleteAudioModal(audio.id)}>Delete</button>
                                        </div> 
                                    </div>
                                )}
                                { this.props.type === 'live' && (
                                    <div className="row">
                                        <div className="col col-4">
                                            <img src = {audio.photo_url} width="300" height="200" />
                                        </div>
                                        <div className = "col col-8">
                                            <h5> {audio.title} </h5>
                                            <p className="text-black" style={{overflow: 'hidden', maxHeight: '50' }}> {audio.description}</p>
                                            <div className="left-align text-sm italic text-secondary margin-bottom-20">Last Updated: {utility.toDateFormat(audio.updated_at)}</div>
                                            <ReactAudioPlayer
                                                src={audio.url}
                                                controls
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
                {this.state.audioList.length > 0 && 
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
                <XMusicEditAudio />
                <XMusicDeleteAudio />
            </React.Fragment>
        )
    }
}


export default XMusicAudioList;