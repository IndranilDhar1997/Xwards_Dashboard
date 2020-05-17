import React, { Component } from 'react';
import { AjaxService, Routes } from '../../../../js/ajax/ajax';

class EditBrand extends Component {
    
    constructor(props) {
        super(props);
        var brandId = props.match.params.id;
        AjaxService.get(Routes.GET_BRAND_BY_ID(brandId), function(response) {
            console.log(response);
        }, function(error){
            console.log(error);
        })
    }

    render() { 
        return ( 
            <React.Fragment>
               <div className="container-fluid margin-top-5  padding-bottom-20">
               <div className="row">
					<div className="col col-12">
						<h4>Edit your brand</h4>
					</div>
                </div>
               </div>
            </React.Fragment>
        );
    }
}
 
export default EditBrand;