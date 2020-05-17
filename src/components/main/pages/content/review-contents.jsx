import React, { Component } from 'react';
import Pagination from "react-js-pagination";

import Table from 'react-bootstrap/Table';
import { AjaxService, Routes } from '../../../../js/ajax/ajax';
import utility from "../../../../js/lib/utility";
import {SideNavBar__SetActiveMenu} from "../../../ui/navbar/navbar";
import ContentDataService from "../../../../js/services/contentDataService";
import Config from "../../../../config";
import {MainNavBar__Toast} from "../../../ui/navbar/navbar";
import {Card} from "react-bootstrap";
import ContentTopBar from "../../../ui/content/content-top-bar";

class InReviewContents extends Component {

    constructor(props) {
        super(props);
        SideNavBar__SetActiveMenu('/content-marketing');
        ContentDataService.removeContentData();
        this.state = { draftDetails: [], totalItemsCount: '', activePage: 1 };
    }

    componentDidMount() {
        AjaxService.get(Routes.GET_INREVIEW_CONTENTS()+"?page="+this.state.activePage, function(response) {
            console.log(response);
            this.setState({draftDetails: response.drafts, totalItemsCount: response.count });
        }.bind(this), function(error) {
            MainNavBar__Toast('err', "Some Error! Unable to fetch drafts");
        })
    }

    handlePageChange(pageNumber) {
        this.setState({activePage: pageNumber});
        AjaxService.get(Routes.GET_INREVIEW_CONTENTS()+"?page="+pageNumber, function(response) {
            this.setState({draftDetails: response.drafts, totalItemsCount: response.count});
        }.bind(this), function(error) {
            MainNavBar__Toast('err', 'Some error happened while fetching details');
        })
    }

    getContentPreview(id) {
        AjaxService.get(Routes.GET_INREVIEW_BY_ID(id), function(response) {
            console.log(response);
            let previewinReviewData = JSON.parse(response.data);
            previewinReviewData.id = response.id;
            previewinReviewData.neo_id = response.neo_id;
            ContentDataService.saveContentData(previewinReviewData);
            window.location.replace(Config[Config.env].url+"/content-marketing/preview?back=review");
        }, function(err) {

            MainNavBar__Toast('err', "Some Error! Please Try Again...");
        })
    }

    deleteContent(draftId) {
        if(window.confirm("Do you really want to discard the draft?")) {
            AjaxService.delete(Routes.DELETE_INREVIEW_CONTENT(draftId), function(response) {
                MainNavBar__Toast('success', "Draft is successfully deleted.");
                window.location.reload();
            }, function(error) {
                MainNavBar__Toast('err', "Some Error! Please try again");
            })
        }
    }

    render() { 
        return ( 
            <div className="container-fluid margin-bottom-50" id= "contents">
				<div className="row margin-top-5">
                    <div className="col col-12">
                        <ContentTopBar toShow={[{label: 'Live Contents', name: 'live', route: '/content-marketing'}, {label: 'Draft Contents', name: 'draft', route: '/content-marketing/drafts'}]} />
                        { this.state.draftDetails.length != 0 && (
                        <div className="row margin-top-20">
                            <div className="col col-12">
                                <h4 className="margin-bottom-20">Summary of Contents in Review</h4>
                                <Table striped={true} bordered={true} hover={true} id="campaign-summary">
                                    <thead>
                                        <tr>
                                            <th>Content Type</th>
                                            <th>Content Title</th>
                                            <th>Status</th>
                                            <th>Expiry Date</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        { this.state.draftDetails.map(inReviewData => (
                                            <tr key ={inReviewData.id}>
                                                <td>{(JSON.parse(inReviewData.data)).contentType}</td>
                                                <td>
                                                    <div className="text-x-default cursor-pointer" onClick={() => this.getContentPreview(inReviewData.id)} >{(JSON.parse(inReviewData.data)).contentTitle}</div>
                                                </td>
                                                <td className="strong text-x-default">
                                                    In Review
                                                </td>
                                                <td>{utility.toDateFormat(inReviewData.expiry_on)}</td>
                                                <td>
                                                    <div className="btn btn-x-love cursor-pointer display-inline" onClick={() => this.deleteContent(inReviewData.id)}>
                                                        <i className="fas fa-trash-alt"></i>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </div>
                            <div className="col col-12 margin-top-30" >
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
                        </div>
                    )} 
                    { this.state.draftDetails.length == 0 && (
                        <Card className="text-center margin-top-20">
                            <Card.Body>
                                <h5 className="text-secondary">No Final Contents Created.</h5>
                            </Card.Body>
                        </Card>
                    )}
                </div>
	        </div>
        </div>
    )}
}
 
export default InReviewContents;