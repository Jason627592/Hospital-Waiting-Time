
import React, { useEffect, useState } from "react";

import { Loading } from "../componets/loading";
import Request from "../request";
import { Helmet } from 'react-helmet';

const CreateLocationForm = () => {
  const initialState = {
    newHospitalName: "",
    newHospitalAddress: "",
    newHospitalLan: 0,
    newHospitalLon: 0,
  };
  const [state, setState] = useState(initialState);

  const submitCreate = () => {
    if (window.confirm("Create New Hospital?")) {
      var data = {
        name: state.newHospitalName,
        address: state.newHospitalAddress,
        latitude: state.newHospitalLan,
        longitude: state.newHospitalLon,
      };
      fetch(`${Request.SERVER_URL}hospital/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((res) => {
          if (res.status === 201) {
            return res.json();
          } else {
            setTimeout(() => {
              alert("Server Error. Please try later");
            }, 2000);
          }
        })
        .then((data) => {
          console.log(data);
          setTimeout(() => {
            alert("Success");
            window.location.href = "/locationManage";
          }, 1000);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  return (
    <div>
    <Helmet>
        <title>Create New Location</title>
  	</Helmet>
      <div>
        <label for="newHospitalName" class="form-label">
          Name
        </label>
        <input
          class="form-control"
          type="text"
          id="newHospitalName"
          onChange={(e) => {
            setState({ ...state, newHospitalName: e.target.value });
          }}
        />
      </div>
      <div>
        <label for="newHospitalAddress" class="form-label">
          Address
        </label>
        <input
          class="form-control"
          type="text"
          id="newHospitalAddress"
          onChange={(e) => {
            setState({ ...state, newHospitalAddress: e.target.value });
          }}
        />
      </div>
      <div>
        <label for="newHospitalLan" class="form-label">
          Lantitude
        </label>
        <input
          class="form-control"
          type="text"
          id="newHospitalLan"
          onChange={(e) => {
            setState({ ...state, newHospitalLan: parseFloat(e.target.value) });
          }}
        />
      </div>
      <div>
        <label for="newHospitalLon" class="form-label">
          Longitude
        </label>
        <input
          class="form-control"
          type="text"
          id="newHospitalLon"
          onChange={(e) => {
            setState({ ...state, newHospitalLon: parseFloat(e.target.value) });
          }}
        />
      </div>
      <button type="button" className="btn btn-primary" onClick={submitCreate}>
        Create
      </button>
    </div>
  );
};

export default CreateLocationForm;
