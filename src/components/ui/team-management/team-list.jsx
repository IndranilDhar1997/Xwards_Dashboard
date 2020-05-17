import React, { Component } from "react";
import ListGroup from 'react-bootstrap/ListGroup';
import BrandService from '../../../js/services/brandService';
import UserProfileService from  '../../../js/services/userProfile';
import { AjaxService, Routes } from "../../../js/ajax/ajax";


class TeamList extends Component {

    constructor() {
        super();
        this.state = {
            memberList: [],
            ownerMemberLength: 0
        }

        //Get Team Member List of selected Brand
        AjaxService.get(Routes.GET_TEAM_MEMBERS(BrandService.getSelectedBrand().id), function(response) {
            let ownerMember = response.filter(member => {
                return (member.roleName === "Owner");
            });
			this.setState({ memberList: response, ownerMemberLength: ownerMember.length });
		}.bind(this), function(error) {
			console.error(error);
		});
    }

    //Delete Memeber from selected Brand
    deleteMember(memberId) {
        let data = {
            memberId: memberId,
            brandId: BrandService.getSelectedBrand().id
        }

        if (window.confirm("Do you really want to remove him from your team?" )) { 
             AjaxService.put(Routes.DELETE_TEAM_MEMBER(), data, function(response) {
                window.location.reload();
            }, function(error) {
                console.error(error);
            })
        }
    }

    render() {
        return(
            <div className="container-fluid margin-top-30 margin-bottom-30">
                {this.state.memberList.length >0 && (
                    <div>
                        <h5 className="margin-left-5">Existing Team Members</h5>
                        <ListGroup>
                        <ListGroup.Item variant="secondary"> Members of <strong>{BrandService.getSelectedBrand().name} </strong> <span className="badge badge-light member-count">{this.state.memberList.length}</span> </ListGroup.Item>
                            {this.state.memberList.map(members=> (
                                <ListGroup.Item key={members.id}>
                                    <div className="d-flex bd-highlight">
                                        <div className="p-2 bd-highlight">
                                            <img className="img-holder" src={members.avatar_url} alt="Member-Display" />
                                        </div>
                                        <div className="p-2 flex-grow-1 bd-highlight">
                                            <div className="font-weight-bolder text-md">{members.first_name} {members.last_name} </div>
                                            <div className="text-primary">@ {members.email}</div>
                                        </div>
                                        <div className="p-2 bd-highlight">
                                            <span className="badge badge-light badge-pill role-holder">{members.roleName}</span> 
                                            {((BrandService.getSelectedBrand().role.name === 'Owner' && (this.state.ownerMemberLength > 1)) || 
                                            (UserProfileService.getUser().id !== members.id)) && 
                                                <button className="btn btn-danger btn-sm margin-left-20" onClick={() => this.deleteMember(members.id)}>
                                                <i className="fas fa-trash-alt"></i></button>
                                            }
                                        </div>
                                    </div>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                </div>
                )}
			</div>
        )
    }
}

export default TeamList;