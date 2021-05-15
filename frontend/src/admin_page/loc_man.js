
import React, { useEffect, useState } from "react";

import { Loading } from "../componets/loading";
import Request from "../request";
import { Helmet } from 'react-helmet';

const LocationManage = () => {
  const initialState = {
    loading: true,
    hospitalData: [],
  };

  const [state, setstate] = useState(initialState);

  function getAllHospitalHandler(response) {
    setstate({
      loading: false,
      hospitalData: response.data,
    });
  }
  function getAllHospitalErrorHandler(error) {
    console.log("Get all hospital error : ", error);
  }

  useEffect(() => {
    Request.getAllHospital(getAllHospitalHandler, getAllHospitalErrorHandler);
  }, []);

  if (state.loading !== false) {
    return <Loading />;
  }

  function deleteLocation(del_hospital_Id) {
    if (window.confirm("Delete this location?")) {
      var data = {
        hospital_id: del_hospital_Id,
      };
      fetch(`${Request.SERVER_URL}delete_loc`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((res) => {
          if (res.status === 200) {
            return res.json();
          } else {
            setTimeout(() => {
              alert("Server Error. Please try later");
            }, 2000);
          }
        })
        .then((res) => {
          console.log(res);
          setTimeout(() => {
            alert("Success");
            window.location.href = "/locationManage";
          }, 1000);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  return (
    <div>
    <Helmet>
        <title>Login Management</title>
  	</Helmet>
      <button
        type="button"
        className="btn btn-primary"
        onClick={() => {
          window.location.href = "/locationCreate";
        }}
      >
        New Hospital
      </button>

      <table className="table">
        <thead>
          <tr>
            <th>#</th>
            <th>Hospital Name</th>
            <th>Address</th>
            <th>Lat</th>
            <th>Lon</th>
            <th>Update</th>
            <th>Remove</th>
          </tr>
        </thead>
        {state.hospitalData.map((hospital, index) => {
          var url = `/locationModify/${hospital.hospitalId}`;
          return (
            <tbody>
              <tr>
                <th>{hospital.hospitalId}</th>
                <td>{hospital.name}</td>
                <td>{hospital.address}</td>
                <td>{hospital.latitude}</td>
                <td>{hospital.longitude}</td>
                <td>
                  <button className="btn btn-secondary" onClick={() => (window.location.href = url)}>
                    Update
                  </button>
                </td>
                <td>
                  <button className="btn btn-danger" onClick={() => deleteLocation(hospital.hospitalId)}>
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          );
        })}
      </table>
    </div>
  );
};

export default LocationManage;
