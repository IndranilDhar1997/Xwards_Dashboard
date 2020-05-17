import React, { Component } from "react";
import BrandService from '../../../../js/services/brandService';
import {TeamManagementTitle, AddMemberForm, TeamList} from "../../../ui/team-management/team-management";

class TeamManagement extends Component {

	render() {
		return (
			<React.Fragment>
				<div className="container-fluid"> 
					<TeamManagementTitle />
					{(BrandService.getSelectedBrand() !== null && BrandService.getSelectedBrand().role.name === 'Owner') && 
						<React.Fragment>
							<AddMemberForm />
							<TeamList />
						</React.Fragment>
					}
				</div>
			</React.Fragment>
		);
	}
}

export default TeamManagement;