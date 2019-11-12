import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";
import { isAuthenticated } from "../auth";
import { updateOrderCancelled } from "../user/apiUser";
import { Link, Redirect } from "react-router-dom";
import { Alert, Select } from "antd";
import "../index.css";
import {
  getSingleOrder,
  updateOrderPlaced,
  updateOrderProcessing,
  updateOrderUnderconstruction,
  updateOrderReady,
  updateOrderFinished,
  getStatusValues,
  updateOrderStatus,
  updateOrderFile1
} from "./apiAdmin";
import moment from "moment";
import "../index.css";

import { FaRegSun, FaAngleRight, FaUserCog } from "react-icons/fa";

const { Option } = Select;

const SingleOrder = props => {
  const [values, setValues] = useState({
    fileLink: "",
    doc: "",
    loading: false,
    errorFile: false,
    formData: ""
  });

  const [order, setOrder] = useState({});
  const [orderBy, setOrderBy] = useState({});

  const [error, setError] = useState(false);
  const [statusValues, setStatusValues] = useState([]);

  const { user, token } = isAuthenticated();

  const { fileLink, errorFile, formData } = values;

  const loadSingleOrder = orderId => {
    getSingleOrder(orderId, user._id, token).then(data => {
      if (data.error) {
        setError(data.error);
      } else {
        setOrder(data);
        setOrderBy(data.OrderedBy);
        console.log(data);
        setValues({
          ...values,
          fileLink: data.fileLink,
          formData: new FormData()
        });
      }
    });
  };

  const loadStatusValues = () => {
    getStatusValues(user._id, token).then(data => {
      if (data.error) {
        console.log(data.error);
      } else {
        setStatusValues(data);
      }
    });
  };

  const handleOrderCancelled = (e, orderId) => {
    let { user, token } = isAuthenticated();
    updateOrderCancelled(user._id, token, orderId, e.target.value).then(
      data => {
        if (data.error) {
          console.log("Status update failed");
        } else {
          console.log("order has been Cancelled");

          loadSingleOrder(orderId, user._id, token);
        }
      }
    );
  };

  const handleOrderConfirm = (e, orderId) => {
    updateOrderPlaced(user._id, token, orderId, e.target.value).then(data => {
      if (data.error) {
        console.log("Status update failed");
      } else {
        console.log("Status updated to Confirmed");
        loadSingleOrder(orderId, user._id, token);
      }
    });
  };

  const handleOrderProcessing = (e, orderId) => {
    updateOrderProcessing(user._id, token, orderId, e.target.value).then(
      data => {
        if (data.error) {
          console.log("Status update failed");
        } else {
          loadSingleOrder(orderId, user._id, token);
        }
      }
    );
  };

  const handleOrderUnderconstruction = (e, orderId) => {
    updateOrderUnderconstruction(user._id, token, orderId, e.target.value).then(
      data => {
        if (data.error) {
          console.log("Status update failed");
        } else {
          loadSingleOrder(orderId, user._id, token);
        }
      }
    );
  };

  const handleOrderReady = (e, orderId) => {
    updateOrderReady(user._id, token, orderId, e.target.value).then(data => {
      if (data.error) {
        console.log("Status update failed");
      } else {
        loadSingleOrder(orderId, user._id, token);
      }
    });
  };

  const handleOrderFinished = (e, orderId) => {
    updateOrderFinished(user._id, token, orderId, e.target.value).then(data => {
      if (data.error) {
        console.log("Status update failed");
      } else {
        loadSingleOrder(orderId, user._id, token);
      }
    });
  };

  const handleStatusChange = (e, orderId, orderEmail, orderMobile) => {
    console.log(e.target.value);
    updateOrderStatus(
      user._id,
      token,
      orderId,
      e.target.value,
      orderEmail,
      orderMobile
    ).then(data => {
      if (data.error) {
        console.log("Status update failed");
      } else {
        loadSingleOrder(orderId, user._id, token);
      }
    });
  };

  const showStatus = (order, orderBy) => (
    <div className="form-group">
      <h3 className="mark bg-success mb-4">Status: {order.status}</h3>

      <select
        className=" p-1 bg-white text-center text-dark "
        onChange={e =>
          handleStatusChange(e, order._id, orderBy.email, orderBy.mobile)
        }
      >
        <option disabled selected>
          Update Status
        </option>
        {statusValues.map((status, index) => (
          <option key={index} value={status}>
            {status}
          </option>
        ))}
      </select>
    </div>
  );

  const handleChange = name => event => {
    const value = name === "doc" ? event.target.files[0] : event.target.value;
    formData.set(name, value);
    setValues({ ...values, [name]: value, formData, errorFile: "" });
  };
  const clickSubmit = event => {
    event.preventDefault();
    setValues({ ...values, errorFile: "", loading: true });
    const { user, token } = isAuthenticated();
    console.log(formData);
    updateOrderFile1(order._id, user._id, token, formData).then(data => {
      if (data.error) {
        setValues({ ...values, errorFile: data.error });
      } else {
        setValues({
          ...values,
          fileLink: "",
          doc: "",

          loading: false,
          errorFile: false
        });
      }
    });
  };

  useEffect(() => {
    setValues({ ...values, formData: new FormData() });

    const orderId = props.match.params.orderId;
    loadSingleOrder(orderId, user._id, token);
    loadStatusValues();
  }, [props]);

  return (
    <div className="container-fluid" style={{ minHeight: "80vh" }}>
      <div className="row">
        <div className="col-6">
          <div className="card">
            <h4 className="card-header" style={{ fontWeight: "500" }}>
              <FaRegSun
                style={{
                  color: "#FFC107",
                  marginRight: "5px",
                  marginBottom: "-4px"
                }}
              />
              Order Toggle Setting
            </h4>
            <div className="row">
              <div className="col-6">
                <ul className="list-inline OrderToggle">
                  <li className="list-inline-item">
                    <p class="font-weight-bold text-success">
                      <FaAngleRight
                        style={{
                          color: "lightgreen",
                          marginRight: "5px",
                          marginBottom: "-3px"
                        }}
                      />
                      Confirm Order
                    </p>
                  </li>
                  <li className="list-inline-item">
                    <select
                      className="form-control"
                      onChange={e => handleOrderConfirm(e, order._id)}
                    >
                      <option disabled selected hidden>
                        (Yes/No)
                      </option>
                      <option value="true">Yes</option>
                      <option value="false">No</option>
                    </select>
                  </li>
                </ul>

                <ul className="list-inline">
                  <li className="list-inline-item">
                    <p class="font-weight-bold text-success">
                      <FaAngleRight
                        style={{
                          color: "lightgreen",
                          marginRight: "5px",
                          marginBottom: "-3px"
                        }}
                      />
                      Processing
                    </p>
                  </li>
                  <li className="list-inline-item">
                    <select
                      className="form-control"
                      onChange={e => handleOrderProcessing(e, order._id)}
                    >
                      <option disabled selected hidden>
                        (Yes/No)
                      </option>
                      <option value="true">Yes</option>
                      <option value="false">No</option>
                    </select>
                  </li>
                </ul>

                <ul className="list-inline">
                  <li className="list-inline-item">
                    <p class="font-weight-bold text-success">
                      <FaAngleRight
                        style={{
                          color: "lightgreen",
                          marginRight: "5px",
                          marginBottom: "-3px"
                        }}
                      />
                      Under Construction
                    </p>
                  </li>
                  <li className="list-inline-item">
                    <select
                      className="form-control"
                      onChange={e => handleOrderUnderconstruction(e, order._id)}
                    >
                      <option disabled selected hidden>
                        (Yes/No)
                      </option>
                      <option value="true">Yes</option>
                      <option value="false">No</option>
                    </select>
                  </li>
                </ul>

                <ul className="list-inline">
                  <li className="list-inline-item">
                    <p class="font-weight-bold text-success">
                      <FaAngleRight
                        style={{
                          color: "lightgreen",
                          marginRight: "5px",
                          marginBottom: "-3px"
                        }}
                      />
                      Ready
                    </p>
                  </li>
                  <li className="list-inline-item">
                    <select
                      className="form-control"
                      onChange={e => handleOrderReady(e, order._id)}
                    >
                      <option disabled selected hidden>
                        (Yes/No)
                      </option>
                      <option value="true">Yes</option>
                      <option value="false">No</option>
                    </select>
                  </li>
                </ul>

                <ul className="list-inline">
                  <li className="list-inline-item">
                    <p class="font-weight-bold text-success">
                      <FaAngleRight
                        style={{
                          color: "lightgreen",
                          marginRight: "5px",
                          marginBottom: "-3px"
                        }}
                      />
                      Finished
                    </p>
                  </li>
                  <li className="list-inline-item">
                    <select
                      className="form-control"
                      onChange={e => handleOrderFinished(e, order._id)}
                    >
                      <option disabled selected hidden>
                        (Yes/No){" "}
                      </option>
                      <option value="true">Yes</option>
                      <option value="false">No</option>
                    </select>
                  </li>
                </ul>

                <ul className="list-inline">
                  <li className="list-inline-item">
                    <p class="font-weight-bold text-success">
                      <FaAngleRight
                        style={{
                          color: "lightgreen",
                          marginRight: "5px",
                          marginBottom: "-3px"
                        }}
                      />
                      Customer Cancellation Option
                    </p>
                  </li>
                  <li className="list-inline-item">
                    <select
                      className="form-control"
                      onChange={e => handleOrderCancelled(e, order._id)}
                    >
                      <option disabled selected hidden>
                        (Yes/No)
                      </option>
                      <option value="true">Yes</option>
                      <option value="false">No</option>
                    </select>
                  </li>
                </ul>
              </div>

              <div className="col-6">
                <ul className="list-group">
                  <li className="list-group-item">
                    {order.placed_order === true ? (
                      <Alert
                        message="Orderplaced Confirmed"
                        type="success"
                        showIcon
                      />
                    ) : (
                      <Alert message="Not yet Confirmed" type="info" showIcon />
                    )}
                  </li>

                  <li className="list-group-item ">
                    {order.processing === true ? (
                      <Alert
                        message="Under Processing"
                        type="success"
                        showIcon
                      />
                    ) : (
                      <Alert message="Not yet Processed" type="info" showIcon />
                    )}
                  </li>

                  <li className="list-group-item">
                    {order.underconstruction === true ? (
                      <Alert
                        message="Under Construction"
                        type="success"
                        showIcon
                      />
                    ) : (
                      <Alert
                        message="Not yet Under Construction"
                        type="info"
                        showIcon
                      />
                    )}
                  </li>
                  <li className="list-group-item">
                    {order.ready === true ? (
                      <Alert message="Ready" type="success" showIcon />
                    ) : (
                      <Alert message="Not yet Ready" type="info" showIcon />
                    )}
                  </li>
                  <li className="list-group-item">
                    {order.finished === true ? (
                      <Alert message="Finished" type="success" showIcon />
                    ) : (
                      <Alert message="Not yet Finished" type="info" showIcon />
                    )}
                  </li>

                  <li className="list-group-item">
                    {order.cancelled === true
                      ? "Customer Cancellation Done"
                      : "No Cancellation yet"}
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="row mt-1">
            <div className="col-12">
              <div className="card p-2">
                <h5 className="card-header">File Upload</h5>

                <form onSubmit={clickSubmit}>
                  {/* <div className="form-group">
                    <label className="btn btn-secondary">
                      <input
                        onChange={handleChange("doc")}
                        type="file"
                        name="doc"
                        accept=".docx"
                        disabled
                      />
                    </label>
                  </div> */}

                  <div className="form-group">
                    <label className="text-muted font-weight-bold">
                      File Link
                    </label>
                    <input
                      onChange={handleChange("fileLink")}
                      type="text"
                      className="form-control"
                      value={fileLink}
                    />
                  </div>

                  <button className="btn btn-warning btn-raised">
                    File Link Upload
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div className="col-4">
          <div className="card p-2">
            <h4 className="card-header">
              <FaUserCog
                style={{
                  color: "#FFC107",
                  marginRight: "5px",
                  marginBottom: "-3px"
                }}
              />
              <span
                style={{
                  color: "lightgreen",
                  textTransform: "uppercase",
                  marginRight: "2px"
                }}
              >
                {orderBy.name}
              </span>
              Details
            </h4>

            <div className="">
              <ul class="list-group">
                <li class="list-group-item">
                  <b>Ordered on:</b>
                  {moment(order.createdAt).format("MMMM Do YYYY, h:mm:ss a")}
                  <span className="ml-1">
                    {moment(order.createdAt).fromNow()}
                  </span>
                </li>
                <li class="list-group-item">
                  <b>Updated on:</b>
                  {moment(order.updatedAt).format("MMMM Do YYYY, h:mm:ss a")}
                  <span className="ml-1">
                    {moment(order.updatedAt).fromNow()}
                  </span>
                </li>

                <li class="list-group-item">
                  <span className="text-warning font-weight-bold">
                    Current Order Status:
                  </span>

                  <h5 className="badge " style={{ backgroundColor: "#FFC107" }}>
                    {order.status}
                  </h5>
                </li>
                <li class="list-group-item">
                  <span className="text-warning font-weight-bold">
                    Customer Id:
                  </span>
                  <span
                    className=" font-weight-bold"
                    style={{ backgroundColor: "#FFC107" }}
                  >
                    {orderBy._id}
                  </span>
                </li>
                <li class="list-group-item">
                  <span className="text-warning font-weight-bold">Name:</span>
                  {orderBy.name}
                </li>
                <li class="list-group-item">
                  <span className="text-warning font-weight-bold">Email:</span>
                  {orderBy.email}
                </li>
                <li class="list-group-item">
                  <span className="text-warning font-weight-bold">
                    Mobile Number:
                  </span>
                  {orderBy.mobile}
                </li>
              </ul>
            </div>
          </div>

          <div className="row mt-1">
            <div className="col-12">
              <div className="card text-center bg-warning p-2">
                <h4 className="card-header" style={{ color: "white" }}>
                  Send Alert to Customer (Sms/Email)
                </h4>

                <div style={{ color: "white" }}>
                  {showStatus(order, orderBy)}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-2">
          <div className="card">
            <h4 className="card-header">Order Notice</h4>

            <div className="">
              <ul class="list-group">
                <li class="list-group-item">
                  {order.cancelled === true ? (
                    <div className="">
                      <Alert
                        message="Order Cancellation Request"
                        type="error"
                        showIcon
                      />
                    </div>
                  ) : (
                    <Alert message="No Notice" type="success" showIcon />
                  )}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleOrder;
