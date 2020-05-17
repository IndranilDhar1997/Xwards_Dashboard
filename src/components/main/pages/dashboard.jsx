import React, { Component } from "react";

class Dashboard extends Component {
	render() {
		return (
			<div className="container-fluid">
				<div className="row">
					<div className="col col-12" >
					<h4 className="margin-top-10 margin-bottom-20 margin-left-5">Advertisement Stats</h4>
					<iframe src="https://dev.kibana.xwards.com/app/kibana#/dashboard/AXFOCp7VFhkZamSxNqMF?embed=true&_g=(refreshInterval%3A('%24%24hashKey'%3A'object%3A493'%2Cdisplay%3A'10%20seconds'%2Cpause%3A!f%2Csection%3A1%2Cvalue%3A10000)%2Ctime%3A(from%3Anow%2Fy%2Cmode%3Aquick%2Cto%3Anow))" height="650" width="100%" frameBorder="0"></iframe>
					<h4 className="margin-top-10 margin-bottom-20 margin-left-5">Overall Stats</h4>
					<iframe src="https://dev.kibana.xwards.com/app/kibana#/dashboard/AXF96CQMXp6I2F5ImlPh?embed=true&_g=(refreshInterval%3A('%24%24hashKey'%3A'object%3A493'%2Cdisplay%3A'10%20seconds'%2Cpause%3A!f%2Csection%3A1%2Cvalue%3A10000)%2Ctime%3A(from%3Anow%2Fy%2Cmode%3Aquick%2Cto%3Anow))" height="400" width="100%" frameBorder="0"></iframe>
					</div>
				</div>
			</div>
		);
	}
}

export default Dashboard;
