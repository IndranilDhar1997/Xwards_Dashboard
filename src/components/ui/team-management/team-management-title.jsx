import React, { Component } from "react";
import BrandService from '../../../js/services/brandService';

class TeamManagementTitle extends Component {
    render () {
        return (
            <div className="row margin-top-20">
                {BrandService.getSelectedBrand() === null && (
                    <h6 className="text-x-love font-weight-bold margin-top-20">First Create a new Brand and becomes the owner of the created brand. Then Manage your team!.</h6>
                )}
                { BrandService.getSelectedBrand() !== null && (
                    <div className="col col-12 margin-top-10">
                        <h3>Team Management for {BrandService.getSelectedBrand().name}</h3>
                        <div className="margin-top-20">
                            Manage your team here. Add new team members, allocate them their roles on Xwards Platform. We have below mentioned roles:
                            <ul className="margin-top-10">
                                <li><span className="strong text-x-default">Owner:</span> Team member, who created the brand. This user, can manage everything related to this brand - creating campaign, adding new team members, view analytics etc.</li>
                                <li><span className="strong text-x-default">Manager:</span> Managers, are like owners, but they cannot add new members to the team. They can perform all other operation as a campaign manager.</li>
                                <li><span className="strong text-x-default">Analyst:</span> An Analyst has only viewing rights to a brand. An analyst cannot create or run a campaign, or see billing options.</li>
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

export default TeamManagementTitle;