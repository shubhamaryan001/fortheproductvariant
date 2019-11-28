import React, { useState, useEffect } from "react";
import SideBar from "./SideBar";
import { Icon } from "antd";
import { isAuthenticated } from "../auth";
import { listOrders } from "./apiAdmin";

const AdminDashboardMain = () => {
  const [orders, setOrders] = useState([]);
  const { user, token } = isAuthenticated();

  const loadOrders = () => {
    listOrders(user._id, token).then(data => {
      if (data.error) {
        console.log(data.error);
      } else {
        setOrders(data);
      }
    });
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const getTotal = () => {
    return orders.reduce((currentValue, nextValue) => {
      return currentValue + nextValue.amount;
    }, 0);
  };

  const showOrdersLength = () => {
    if (orders.length > 0) {
      return <>{orders.length}</>;
    } else {
      return <> No orders</>;
    }
  };

  return (
    <div className="wrapper ">
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-2">
            <SideBar />
          </div>
          <div className="col-md-10" style={{ marginTop: "5rem" }}>
            <div className="row">
              <div className="col-md-4">
                <div className="card">
                  <div className="card-header">
                    <div className="row">
                      <div className="col-6">
                        <Icon
                          type="dollar-circle"
                          theme="filled"
                          style={{
                            marginTop: "-3rem",
                            fontSize: "5rem",
                            color: "#ffc107"
                          }}
                        />
                      </div>
                      <div className="col-6 text-right">
                        <h6 className="lead">Total Earning</h6>
                        <h5 className=" card-title">
                          <b>₹{getTotal()}</b>
                        </h5>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card">
                  <div className="card-header">
                    <div className="row">
                      <div className="col-6">
                        <Icon
                          type="dropbox-circle"
                          theme="filled"
                          style={{
                            marginTop: "-3rem",
                            fontSize: "5rem",
                            color: "#95de64"
                          }}
                        />
                      </div>
                      <div className="col-6 text-right">
                        <h6 className="lead">New Projects</h6>

                        <h5 className=" card-title">
                          <b>{showOrdersLength()}</b>
                        </h5>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card">
                  <div className="card-header">
                    <div className="row">
                      <div className="col-6">
                        <Icon
                          type="idcard"
                          theme="filled"
                          style={{
                            marginTop: "-3rem",
                            fontSize: "5rem",
                            color: "#ffc107"
                          }}
                        />
                      </div>
                      <div className="col-6  text-right">
                        <h6 className="lead">Total Customers</h6>
                        <h5 className="card-title">
                          <b>10</b>
                        </h5>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardMain;
