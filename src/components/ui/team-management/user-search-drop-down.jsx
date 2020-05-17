import React, { Component } from "react";
import Select from 'react-select';
import $ from 'jquery';

import { AjaxService, Routes } from "../../../js/ajax/ajax";

var searchTyping = null;

const selectMemberTheme = {
	control: (base, state) => ({
		...base,
	}),
	option: (base, state) => ({
		...base,
		background: state.isFocused ? '#0350a4' : '#fff',
		fontWeight: state.isFocused ? 'bold' : '',
		color: state.isFocused ? '#fff' : '#000',
		"&:hover": {
			background: state.isFocused ? '#0350a4' : '#fff',
			fontWeight: state.isFocused ? 'bold' : '',
			color: state.isFocused ? '#fff' : '#000',
			cursor: state.isFocused ? 'pointer' : 'initial',
		}
	})
};

var updateSearchTeamMemberList = function (list) {
	this.setState({members: list});
}

class UserSearchDropDown extends Component {

    constructor() {
        super();
        this.state = {members: []};
		updateSearchTeamMemberList = updateSearchTeamMemberList.bind(this);
    }

    searchUser() {
        let elementId = this.props.id;
        let searchedUserData = $('#'+elementId).val();
		if (searchTyping) {
			//if a new letter comes in do not execute the previous search
			clearTimeout(searchTyping);
		}
		if (searchedUserData.length > 2) {
			//Give 1.5 second delay before sending request to the server.
			searchTyping = setTimeout(function() {
				AjaxService.get(Routes.SEARCHMEMBER(searchedUserData), function (response) {
                    response = response.map(user=> {
                        return {value: user.id, label: user.first_name + " ("+user.email+")" };
                    });
					updateSearchTeamMemberList(response);
				}, function (error) {
					//console.log(error);
				});
			}, 1500);
		}
    }

    render() {
        return (
            <Select
                inputId={this.props.id}
                name={this.props.name}
                onInputChange={() => this.searchUser()}
                options={this.state.members}
                classNamePrefix="react-select"
                styles={selectMemberTheme}
                isClearable={true}
                isSearchable={true}
            />
        );
    }
}

export default UserSearchDropDown;