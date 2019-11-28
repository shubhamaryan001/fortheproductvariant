import React, { useState, useEffect } from "react";
import { isAuthenticated } from "../auth";
import { Link } from "react-router-dom";
import { listOrders, getStatusValues, updateOrderStatus } from "./apiAdmin";
import moment from "moment";
import {
  Accordion,
  AccordionItem,
  AccordionItemButton,
  AccordionItemHeading,
  AccordionItemPanel
} from "react-accessible-accordion";
import "react-accessible-accordion/dist/fancy-example.css";
import SideBar from "./SideBar";
import { Tag } from "antd";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [statusValues, setStatusValues] = useState([]);

  const { user, token } = isAuthenticated();

  const loadOrders = () => {
    listOrders(user._id, token).then(data => {
      if (data.error) {
        console.log(data.error);
      } else {
        console.log(data);
        setOrders(data);
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

  useEffect(() => {
    loadOrders();
    loadStatusValues();
  }, []);

  const showInput = (key, value) => (
    <div className="input-group mb-2 mr-sm-2">
      <div className="input-group-prepend">
        <div className="input-group-text">{key}</div>
      </div>
      <input type="text" value={value} className="form-control" readOnly />
    </div>
  );

  const getTotal = () => {
    return orders.reduce((currentValue, nextValue) => {
      return currentValue + nextValue.amount;
    }, 0);
  };

  const getfilter = orders.filter(
    (order, index, orders) => order.ready === true
  );
  const sort = orders.sort(function(a, b) {
    if (a.createdAt < b.createdAt) return 1;
    if (a.createdAt > b.createdAt) return -1;
  });

  const showFilter = () => {
    if (getfilter.length > 0) {
      return (
        <>
          {getfilter.map((k, index) => {
            return (
              <div key={index}>
                <p>{k.transaction_id}</p>
                <p>{k.amount}</p>
                <p>{k._id}</p>
              </div>
            );
          })}
        </>
      );
    } else {
      return <>Not Found</>;
    }
  };

  console.log(getfilter, sort);

  const showOrdersLength = () => {
    if (orders.length > 0) {
      return (
        <>
          <h1 className="text-danger display-2">
            Total orders: {orders.length}
          </h1>
        </>
      );
    } else {
      return <h1 className="text-danger">No orders</h1>;
    }
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
        loadOrders();
      }
    });
  };
  const showStatus = o => (
    <div className="form-group">
      <h3 className="mark mb-4">Status: {o.status}</h3>

      <select
        className="form-control"
        onChange={e =>
          handleStatusChange(e, o._id, o.OrderedBy.email, o.OrderedBy.mobile)
        }
      >
        <option>Update Status</option>
        {statusValues.map((status, index) => (
          <option key={index} value={status}>
            {status}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="wrapper">
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-2">
            <SideBar />
          </div>

          <div className="col-md-10" style={{ marginTop: "5rem" }}>
            <div className="row">
              {orders.map((o, i) => {
                return (
                  <div key={i} className="col-md-4">
                    <div className="card" style={{ width: "25rem" }}>
                      {o.status === "Order Confirmed" ? (
                        <div
                          className="card-header text-center"
                          style={{ backgroundColor: "#ffec3d" }}
                        >
                          <h5>Order Id: {o._id}</h5>

                          <Tag color="#2db7f5">{o.status}</Tag>
                        </div>
                      ) : (
                        <div
                          className="card-header text-center "
                          style={{ backgroundColor: "#a0d911" }}
                        >
                          <h5>Order Id: {o._id}</h5>
                          <Tag color="#87d068">{o.status}</Tag>
                        </div>
                      )}
                      <div className="card-content">
                        <ul className="list-inlin">
                          <li class="list-inline-item">OrderedBy</li>
                          <li class="list-inline-item"> {o.OrderedBy.name}</li>
                        </ul>
                        <ul className="list-inlin">
                          <li class="list-inline-item">User Register Mobile</li>
                          <li class="list-inline-item">{o.OrderedBy.mobile}</li>
                        </ul>
                      </div>
                      <Link
                        className="btn btn-raised btn-info"
                        to={`/order/${o._id}`}
                      >
                        Order Details
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Orders;
