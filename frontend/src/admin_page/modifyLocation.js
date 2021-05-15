
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { Loading } from "../componets/loading";
import Request from "../request";
import { Helmet } from 'react-helmet';

const ModifyLocationForm = () => {
  const initialState = {
    modifyHospitalName: "",
    modifyHospitalAddress: "",
    modifyHospitalLan: 0,
    modifyHospitalLon: 0,
    loading: true
  };

  let {hospitalId} = useParams();


  const [state, setState] = useState(initialState);
  async function fetchHospital() {
    await fetch(`${Request.SERVER_URL}hospital/${hospitalId}`)
    .then((res) => res.json())
    .then((res) => {
      console.log(res)
      setState({
        loading: false,
        modifyHospitalName: res.name,
        modifyHospitalAddress: res.address,
        modifyHospitalLan: res.latitude,
        modifyHospitalLon: res.longitude,
      });
    });
  }
  useEffect(() => {
    fetchHospital()
  }, [])

  const submitModify = () => {
    if (window.confirm("Modify this Hospital?")) {
      var data = {
        hospitalId: hospitalId,
        name: state.modifyHospitalName,
        address: state.modifyHospitalAddress,
        latitude: state.modifyHospitalLan,
        longitude: state.modifyHospitalLon,
      };
      fetch(`${Request.SERVER_URL}hospital/update`, {
        method: "PUT",
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
  if(state.loading !== false){
    return <Loading />
  }

  return (
    <div>
    <Helmet>
        <title>Update Location</title>
  	</Helmet>
      <div>
        <label for="HospitalName" class="form-label">
          Name
        </label>
        <input
          placeholder={state.modifyHospitalName}
          class="form-control"
          type="text"
          id="HospitalName"
          onChange={(e) => {
            setState({ ...state, modifyHospitalName: e.target.value });
          }}
        />
      </div>
      <div>
        <label for="HospitalAddress" class="form-label">
          Address
        </label>
        <input
          placeholder={state.modifyHospitalAddress}
          class="form-control"
          type="text"
          id="newHospitalAddress"
          onChange={(e) => {
            setState({ ...state, modifyHospitalAddress: e.target.value });
          }}
        />
      </div>
      <div>
        <label for="HospitalLan" class="form-label">
          Lantitude
        </label>
        <input
          placeholder={state.modifyHospitalLan}
          class="form-control"
          type="text"
          id="HospitalLan"
          onChange={(e) => {
            setState({
              ...state,
              modifyHospitalLan: parseFloat(e.target.value),
            });
          }}
        />
      </div>
      <div>
        <label for="HospitalLon" class="form-label">
          Longitude
        </label>
        <input
          placeholder={state.modifyHospitalLon}
          class="form-control"
          type="text"
          id="HospitalLon"
          onChange={(e) => {
            setState({
              ...state,
              modifyHospitalLon: parseFloat(e.target.value),
            });
          }}
        />
      </div>
      <button type="button" className="btn btn-primary" onClick={submitModify}>
        Confirm
      </button>
    </div>
  );
};

export default ModifyLocationForm;
