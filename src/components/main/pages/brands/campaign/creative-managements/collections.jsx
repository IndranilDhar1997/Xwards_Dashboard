import React, { Component } from 'react';

import { Card, Button, Table } from 'react-bootstrap';
import { SideNavBar__SetActiveMenu } from "../../../../../ui/navbar/navbar";
import { AjaxService, Routes } from '../../../../../../js/ajax/ajax';
import {MainNavBar__Toast} from "../../../../../ui/navbar/navbar";
import { CreateCollection, CreateCollection__OpenModal } from "../../../../../ui/creative-management/create-collection-modal";
import { EditCollection, EditCollection__OpenModal } from '../../../../../ui/creative-management/edit-collection-modal';
import utility from '../../../../../../js/lib/utility';
import BrandService from '../../../../../../js/services/brandService';

export default  class CreativeManagement extends Component {
    
    constructor(props) {
        super(props);
        SideNavBar__SetActiveMenu('/brands/campaigns');
        this.state = {
            collectionList : [],
            brandId: BrandService.getSelectedBrand().id
        }
    }
    
    componentDidMount() {
        AjaxService.get(Routes.Get_All_Collections(this.state.brandId), function (response) {
            console.log(response);
            this.setState({ collectionList: response});
		}.bind(this), function(error){
			console.log(error);
			MainNavBar__Toast('err', "Some error occured while fetching your collections.");
		});
    }

    deleteCollection = (e, collectionId) => {
        e.preventDefault();
        let verify = window.prompt("Type 'DELETE' to delete this collection.");
        if (!(verify === 'DELETE')) {
            MainNavBar__Toast('err', 'ERR. Please type "DELETE"...');
            return false;
        }
        AjaxService.delete(Routes.Delete_Collection(this.state.brandId, collectionId), function (response) {
            console.log(response);
            window.location.reload();
            MainNavBar__Toast('success', " Deleted Successfully");
		}, function(error){
            console.log(error);
            if(error.status === 403) {
                MainNavBar__Toast('err', error.responseText);    
            } else {
                MainNavBar__Toast('err', "Some error occured while deleting your collections.");
            }
		});
    }

    getCreatives = (e, collectionId) => {
        e.preventDefault();
        this.props.history.push({ pathname: "/brands/campaigns/creative-managements/" +collectionId+ "/creatives"});
    }

    render() { 
        return ( 
            <React.Fragment>
                <div className="container-fluid margin-top-5">
                    <div className="row padding-bottom-20">
                        <div className="col col-12 ">
                            {(this.state.collectionList.length === 0) ?
                                <Card className="text-center h-100">
                                    <Card.Body>
                                        <h2 className="text-x-love margin-bottom-20">No Collections Created</h2>
                                        <h6 className="text-x-default max-width-70 margin-auto">
                                            To start with Creative Management you need to create a collection. Collection will contain a Collection Name.
                                        </h6>
                                        <Button variant="x-love" className="margin-top-30" type="submit" id="create_collection_button" sm="4" onClick={(e) => CreateCollection__OpenModal(e)}>
                                            <i className = "fas fa-plus"></i>  Create new Collection
                                        </Button>
                                    </Card.Body>
                                </Card>
                                :
                                <React.Fragment>
                                    <Button variant="x-love" type="submit" id="create_collection_button" sm="4" onClick={(e) => CreateCollection__OpenModal(e)}>
                                        <i className = "fas fa-plus"></i>  Create new Collection
                                    </Button>
                                    <h4 className="margin-top-20 margin-bottom-20">Your Collections</h4>
                                    <div className="row" >
                                        <div className="col col-12 padding-bottom-50 center-align">
                                            <Table striped={true} bordered={true} hover={true} id="collections">
                                                <thead>
                                                    <tr>
                                                        <th>Name</th>
                                                        <th>Created At</th>
                                                        <th></th>
                                                        <th></th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {this.state.collectionList.map(data => (
                                                        <tr key={data.id}>
                                                            <td>
                                                                <a className="text-x-default cursor-pointer margin-left-15" onClick={(e) => this.getCreatives(e, data.id)}>
                                                                    {data.collection_name}
                                                                </a>
                                                            </td>
                                                            <td>{utility.toDateFormat(data.created_at)}</td>
                                                            <td>
                                                                <a className="text-x-love cursor-pointer margin-left-15" onClick={(e) => this.deleteCollection(e, data.id)} >
                                                                    <i className="fas fa-trash"></i>
                                                                </a>
                                                            </td>
                                                            <td>
                                                                <a className="text-x-love cursor-pointer margin-left-15" onClick={(e) => EditCollection__OpenModal(e, data.id)} >
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
                    <CreateCollection />
                    <EditCollection />
                </div>
            </React.Fragment>
        );
    }
}