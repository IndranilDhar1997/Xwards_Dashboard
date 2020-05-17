import React, { Component } from "react";
import { Link } from 'react-router-dom';
import {Table, Card} from 'react-bootstrap';

import { AjaxService, Routes} from "../../../../js/ajax/ajax";
import BrandService from '../../../../js/services/brandService';

class ManageBrands extends Component {

	constructor(props) {
		super(props);
		this.state = {
			brandListLength: BrandService.getBrandList().length
		}
	}

	deleteBrand(brandId) {
		console.log(brandId);
        if (window.confirm("Do you really want to remove this Brand?" )) { 
             AjaxService.delete(Routes.DELETE_BRAND(brandId), function(response) {
				console.log(response.data);
                window.location.reload();
            }, function(error) {
                console.error(error.response);
            })
        }
    }

	render() {
		return (
			<div className="container-fluid">
				<div className="row">
					<div className="col col-12">
						{(this.state.brandListLength !== 0) ? (
							<React.Fragment>
								<h4 className="margin-top-10 margin-bottom-20 margin-left-5">Summary of Brands</h4>
								<Table striped={true} bordered={true} hover={true} className="text-center">
									<thead>
										<tr>
											<th>Brand Name</th>
											<th>Registered Name</th>
											<th>Action</th>
										</tr>
									</thead>
									<tbody>
										{ BrandService.getBrandList().map(data => (
											<tr key = {data.id}>
												{data.role.name === "Owner" ? (
													<td>
														<Link to={"/brands/" + data.id} className="text-x-default">{data.name}</Link>
													</td>
												) : (
													<td>{data.name}</td>
												)}
												<td>{data.registered_name}</td>
												{data.role.name === "Owner" ? (
													<td>
														<button className="btn btn-link" onClick={() => this.deleteBrand(data.id)}>Delete</button>
													</td>
												) : (
													<td><strong>NA</strong> as You are <strong>{data.role.name}</strong></td>
												)}
											</tr>
										))}
									</tbody>
								</Table>
							</React.Fragment>
						) : (
							<Card className="text-center margin-top-20">
								{/* If channel list is zero */}
								<Card.Body>
									<h2 className="text-x-love margin-bottom-20">No Brands Created</h2>
									<h6 className="text-x-default max-width-70 margin-auto">
										To create your own brand, please visit the dropdown of the brands and add brand there. Creating a brand will make you brand owner.
									</h6>
								</Card.Body>
							</Card>
						)}
						
					</div>
				</div>
			</div>
		);
	}
}

export default ManageBrands;
