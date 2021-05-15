
import React from "react";
import { useEffect, useState } from "react";
import { Helmet } from 'react-helmet';


const LocationTable = (props) => {
	let initialState = {
		hospitalList: props.hospitalList,
        filteredList : props.hospitalList,
        sortField : "id",
        searchField : "hospitalId",
        searchKeyword : "",
	};
	const [state, setstate] = useState(initialState);

    function onSortFieldChange(e){
        setstate({...state, sortField : e.target.value});
    }

    function onSearchFieldChange(e){
        setstate({...state, searchField : e.target.value});
    }

    function onSearchChange(){
		let searchKeyword = document.querySelector("#search").value;
        let tempFilteredList = [];
        console.log(state.searchField);
        if (searchKeyword.length == 0) {
            setstate({...state, filteredList : state.hospitalList});
        }
        else {
            tempFilteredList = state.hospitalList.filter((hospital) => {
                return hospital[state.searchField].toString().toLowerCase().includes(searchKeyword);
            });
            setstate({...state, filteredList : tempFilteredList});
        }
	}

    function sortedTable(){
        let currentHospitalList = state.filteredList;
        switch(state.sortField){
            case "id":
                currentHospitalList = currentHospitalList.sort((a, b) => a.hospitalId - b.hospitalId);
                break;
            case "name":
                currentHospitalList = currentHospitalList.sort((a, b) => a.name >= b.name ? 1 : -1);
                break;
            case "address":
                currentHospitalList = currentHospitalList.sort((a, b) => a.address >= b.address ? 1 : -1);
                break;
            case "latitude":
                currentHospitalList = currentHospitalList.sort((a, b) => a.latitude - b.latitude);
                break;
            case "longitude":
                currentHospitalList = currentHospitalList.sort((a, b) => a.longitude - b.longitude);
                break;
            default :
                currentHospitalList = currentHospitalList.sort((a, b) => a.hospitalId - b.hospitalId);
                break;
        }
    }
	return (
		<div>
            <Helmet>
                <title>Hospital Details</title>
      	    </Helmet>
            <div className="sorting-searching-container center-child">
                <div className="searching-container center-child">
                    <div class="form-floating mb-3 col-10 m-2">
                            <input id="search" class="form-control" placeholder="Search" onChange={onSearchChange}/>
                            <label for="search">Search</label>
                    </div>
                    <p>by</p>
                        <select className="m-2" name="sortField" id="sortField" defaultValue="ID" value={state.searchField} onChange={onSearchFieldChange}>
                            <option value="hospitalId">ID</option>
                            <option value="name">Name</option>
                            <option value="address">Address</option>
                            <option value="latitude">Latitude</option>
                            <option value="longitude">Longitude</option>
                        </select>
                </div>
                <p>Sort By</p>
                <select className="m-2" name="sortField" id="sortField" defaultValue="ID" value={state.sortField} onChange={onSortFieldChange}>
                    <option value="id">ID</option>
                    <option value="name">Name</option>
                    <option value="address">Address</option>
                    <option value="latitude">Latitude</option>
                    <option value="longitude">Longitude</option>
                </select>
            </div>
            {sortedTable()}
			<table className="table">
				<thead>
					<tr>
						<th>#</th>
						<th>Hospital Name</th>
						<th>Address</th>
						<th>Lat</th>
						<th>Lon</th>
					</tr>
				</thead>
				{state.filteredList.map((hospital, index) => {
					return (
						<tbody key={index}>
							<tr>
								<th>{hospital.hospitalId}</th>
								<td>{hospital.name}</td>
								<td>{hospital.address}</td>
								<td>{hospital.latitude}</td>
								<td>{hospital.longitude}</td>
							</tr>
						</tbody>
					);
				})}
			</table>
		</div>
	);
};

export default LocationTable;
