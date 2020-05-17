import React, { Component } from 'react';
import BrandService from '../../../../../../../js/services/brandService';
import { SideNavBar__SetActiveMenu } from "../../../../../../ui/navbar/navbar";
import { Card, Button, Table } from 'react-bootstrap';
import { AjaxService, Routes } from '../../../../../../../js/ajax/ajax';
import {MainNavBar__Toast} from "../../../../../../ui/navbar/navbar";
import utility from '../../../../../../../js/lib/utility';

export default class Creatives extends Component {
    
    constructor(props) {
        super(props);
        SideNavBar__SetActiveMenu('/brands/campaigns');
        this.state = {
            creativeList: [],
            brandId: BrandService.getSelectedBrand().id,
            collectionId: this.props.match.params.collectionId,
        }
    }

    componentDidMount() {
        AjaxService.get(Routes.Get_All_Creatives(this.state.brandId,this.state.collectionId), function (response) {
            console.log(response);
            this.setState({ creativeList: response});
		}.bind(this), function(error){
			console.log(error);
			MainNavBar__Toast('err', "Some error occured while fetching your creatives.");
        });
    }

    addCreative = e => {
        e.preventDefault();
        this.props.history.push({ pathname: "/brands/campaigns/creative-managements/" +this.state.collectionId+ "/creatives/add/"})
    }

    getCreativeById = (e, creativeId) => {
        e.preventDefault();
        this.props.history.push({ pathname: "/brands/campaigns/creative-managements/" + this.state.collectionId +"/creatives/edit/" + creativeId});
    }

    deleteCreative = (e, creativeId) => {
        e.preventDefault();
        let verify = window.prompt("Type 'DELETE' to delete this creative.");
        if (!(verify === 'DELETE')) {
            MainNavBar__Toast('err', 'ERR. Please type "DELETE"...');
            return false;
        }
        AjaxService.delete(Routes.Delete_Creative(this.state.brandId, this.state.collectionId, creativeId), function (response) {
            console.log(response);
            window.location.reload();
            MainNavBar__Toast('success', " Deleted Successfully");
		}, function(error){
			console.log(error);
			MainNavBar__Toast('err', "Some error occured while deleting your creative.");
		});
    }


    render() { 
        return ( 
            <React.Fragment>
                <div className="container-fluid margin-top-5">
                    <div className="row padding-bottom-20">
                        <div className="col col-12 ">
                            {(this.state.creativeList.length === 0) ?
                                <Card className="text-center h-100">
                                    <Card.Body>
                                        <h2 className="text-x-love margin-bottom-20">No Creatives Added</h2>
                                        <h6 className="text-x-default max-width-70 margin-auto">
                                            Add a Creative for the respective collection and the selected brand.
                                        </h6>
                                        <Button variant="x-love" className="margin-top-30" type="submit" id="add_creative_button" sm="4" onClick={(e) => this.addCreative(e)}>
                                            <i className = "fas fa-plus"></i>  Add Creative
                                        </Button>
                                    </Card.Body>
                                </Card>
                                :
                                <React.Fragment>
                                    <Button variant="x-love" type="submit" id="create_creative_button" sm="4" onClick={(e) => this.addCreative(e)}>
                                        <i className = "fas fa-plus"></i>  Add Creative
                                    </Button>
                                    <h4 className="margin-top-20 margin-bottom-20">Your Creatives</h4>
                                    <div className="row" >
                                        <div className="col col-12 padding-bottom-50 center-align">
                                            <Table striped={true} bordered={true} hover={true} id="collections">
                                                <thead>
                                                    <tr>
                                                        <th>Title</th>
                                                        <th>Status</th>
                                                        <th>Created At</th>
                                                        <th></th>
                                                        <th></th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {this.state.creativeList.map(data => (
                                                        <tr key={data.id}>
                                                            <td>
                                                                <a className="text-x-default font-weight-700 margin-left-15" >
                                                                    {data.title}
                                                                </a>
                                                            </td>
                                                            <td className="font-weight-700">{data.is_blocked === null ? 'Active' : 'Blocked'}</td>
                                                            <td>{utility.toDateFormat(data.created_at)}</td>
                                                            <td>
                                                                <a className="text-x-love cursor-pointer margin-left-15" onClick={(e) => this.deleteCreative(e, data.id)} >
                                                                    <i className="fas fa-trash"></i>
                                                                </a>
                                                            </td>
                                                            <td>
                                                                <a className="text-x-love cursor-pointer margin-left-15" onClick={(e) => this.getCreativeById(e, data.id)} >
                                                                    <i className="fas fa-edit"></i>
                                                                </a>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </Table>
                                        </div>
                                    </div>
                                </React.Fragment>
                            }
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}