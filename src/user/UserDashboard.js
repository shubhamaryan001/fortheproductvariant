import React, { useState, useEffect } from "react";
import { isAuthenticated } from "../auth";
import { Link } from "react-router-dom";
import "../index.css";
import { razorPayOptions } from "../core/checkout.helper";
import { getUserBalance } from "../admin/apiAdmin";
import { getOrdersHistory } from "./apiUser";
import moment from "moment";
import { API } from "../config";

import { FaEdit, FaShoppingCart } from "react-icons/fa";

const Razorpay = window.Razorpay;
const Dashboard = () => {
  const [order, setOrder] = useState([]);
  let {
    user: { _id, name, email, mobile, role, wallet_balance },
    token
  } = isAuthenticated();

  const initOrder = (userId, token) => {
    getOrdersHistory(userId, token).then(data => {
      if (data.error) {
        console.log(data.error);
      } else {
        setOrder(data);
      }
    });
  };

  const sort = order.sort(function(a, b) {
    if (a.createdAt < b.createdAt) return 1;

    if (a.createdAt > b.createdAt) return -1;
  });

  const [values, setValues] = useState({
    amount: 0,
    currentWalletBalance: wallet_balance
  });

  const { amount, currentWalletBalance } = values;

  // Razorpay
  const rzp1 = new Razorpay(
    razorPayOptions(
      amount,
      { name: name ? name : "", email: email ? email : "", _id, token },
      true
    )
  );

  const openRzrPay = event => {
    rzp1.open();
    event.preventDefault();
    getBalance();
  };

  const handleChange = name => event => {
    setValues({ ...values, ["amount"]: event.target.value });
  };

  const getBalance = async event => {
    const currentBalance = await getUserBalance({ userId: _id });
    setValues({
      ...values,
      ["currentWalletBalance"]: currentBalance.user.wallet_balance
    });
  };

  useEffect(() => {
    initOrder(_id, token);
    getBalance();
  }, []);

  // const showOrdersLength = () => {
  //   if (order.length > 0) {
  //     return Total orders: {order.length};
  //   } else {
  //     return <h4 className="text-danger text-center">No orders</h4>;
  //   }
  // };

  const userLinks = () => {
    //
    return (
      <div className="card profile-card">
        <div className="card-header p-2">
          <div className="row">
            <div className="col-6">
              <div className="pt-2">
                {order.length > 0 ? (
                  <h4> Recent Orders ( {order.length})</h4>
                ) : (
                  <h4> No Orders</h4>
                )}
              </div>
            </div>
            <div className="col-6">
              <div className="pt-2 text-right">
                <Link
                  className="btn "
                  to="/cart"
                  style={{
                    background: "#10DC60",
                    color: "#fff",
                    borderRadius: "50px"
                  }}
                >
                  <b>Cart</b>
                  <FaShoppingCart
                    style={{
                      fontSize: "16px",
                      color: "#fff",
                      margin: "0 0 -2px 2px"
                    }}
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="">
          {order.map((o, i) => {
            return (
              <div key={i} className="container mt-2 mb-2">
                <div className="card">
                  <div
                    className="card-header "
                    style={{ background: "#10DC60" }}
                  >
                    <div className="row">
                      <div className="col-6 text-white">Order Id: {o._id}</div>
                      <div className="col-6  text-right">
                        {o.status === "Order Confirmed" ? (
                          <h6
                            className="text-white badge badge-pill badge-warning"
                            style={{ background: "#FFCE00" }}
                          >
                            {o.status}
                          </h6>
                        ) : (
                          <h6
                            className="text-white badge badge-pill badge-warning"
                            style={{ background: "#1890ff" }}
                          >
                            {o.status}
                          </h6>
                        )}
                      </div>
                    </div>
                  </div>
                  {o.products.map((p, index) => {
                    return (
                      <div key={index} className="card-content">
                        <div className="row">
                          <div className="col-6">
                            <div className="p-2">
                              <img
                                className="rounded-circle"
                                src={`${API}/product/photo/${p._id}`}
                                alt={p.name}
                                style={{
                                  maxHeight: "75px",
                                  minHeight: "75px",
                                  minWidth: "75px",
                                  maxWidth: "75px"
                                }}
                              />
                              <div className="pt-2">
                                <p>{moment(o.createdAt).fromNow()}</p>
                              </div>
                            </div>
                          </div>
                          <div className="col-6">
                            <div className="pt-4 ">
                              <h5 className=" text-muted">{p.name}</h5>
                            </div>

                            <div className="p-2">
                              <Link
                                className="btn btn-raised btn-sm  text-white"
                                to={`/order/customer/${o._id}`}
                                style={{
                                  float: "right",
                                  background: "#ffce00"
                                }}
                              >
                                <b>Order Details</b>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* <li className="list-group-item">
            <h5>Add Money to wallet</h5>
            <form>
              <div className="form-group">
                <label className="text-muted">Amount</label>
                <input
                  onChange={handleChange("amount")}
                  type="number"
                  className="form-control"
                  value={amount}
                />
              </div>
              <button
                onClick={openRzrPay}
                className="btn btn-raised btn-success"
                id="rzp-button1"
              >
                Add Money
              </button>
            </form>
          </li> */}
      </div>
    );
  };
  const DefaultImg =
    "https://res.cloudinary.com/djnv06fje/image/upload/v1577008134/dummy-user-img-1_p1kcf2.png";

  const photoUrl = _id ? `${API}/user/photo/${_id}` : DefaultImg;

  const userInfo = () => {
    return (
      <div className="card " style={{ width: "25rem", margin: "0 auto" }}>
        <h3 className="card-header"> {name}'s Information</h3>
        <div className="p-3" style={{ margin: "0 auto" }}>
          <img
            className="rounded-circle"
            src={photoUrl}
            onError={i => (i.target.src = `${DefaultImg}`)}
            alt={name}
            style={{
              objectFit: "cover",
              minHeight: "200px",
              minWidth: "200px",
              maxHeight: "200px",
              maxWidth: "200px",
              margin: "0 auto"
            }}
          />
        </div>

        <div className="row pt-3">
          <div className="col-6">
            <div className="pl-3 ">
              <p
                style={{ borderLeft: "3px solid #f1c40f", paddingLeft: "2px" }}
              >
                <b>Name:</b>
              </p>
            </div>
          </div>
          <div className="col-6">
            <p className="text-muted">{name}</p>
          </div>
        </div>

        <div className="row">
          <div className="col-6">
            <div className="pl-3">
              <p
                style={{ borderLeft: "3px solid #f1c40f", paddingLeft: "2px" }}
              >
                <b>Email:</b>
              </p>
            </div>
          </div>
          <div className="col-6">
            <p>{email}</p>
          </div>
        </div>

        <div className="row">
          <div className="col-6">
            <div className="pl-3">
              <p
                style={{ borderLeft: "3px solid #f1c40f", paddingLeft: "2px" }}
              >
                <b>Register Mobile Number:</b>
              </p>
            </div>
          </div>
          <div className="col-6">
            <p>{mobile}</p>
          </div>
        </div>

        <div className="row">
          <div className="col-6">
            <div className="pl-3">
              <p
                style={{ borderLeft: "3px solid #f1c40f", paddingLeft: "2px" }}
              >
                <b>Account Type:</b>
              </p>
            </div>
          </div>
          <div className="col-6">
            {role === 1 ? (
              <p className="text-muted">Admin</p>
            ) : (
              <p className="text-muted">Customer Account</p>
            )}
          </div>
        </div>
        <div className="row">
          <div className="col-6">
            <div className="pl-3">
              <p
                style={{ borderLeft: "3px solid #f1c40f", paddingLeft: "2px" }}
              >
                <b>Wallet Balance:</b>
              </p>
            </div>
          </div>
          <div className="col-6">
            {currentWalletBalance ? (
              <p className="text-muted">₹{currentWalletBalance}</p>
            ) : (
              <p className="text-muted">₹. 0</p>
            )}
          </div>
        </div>

        <div className="row">
          <div className="col-6"></div>
          <div className="col-6 ">
            <div className="text-right p-3 font-weight-bold">
              <Link
                className="btn   btn-sm"
                to={`/profile/${_id}`}
                style={{
                  background: "#f1c40f",
                  color: "#fff",
                  borderRadius: "5px"
                }}
              >
                <b>
                  Update Profile
                  <FaEdit
                    style={{ margin: "0 0 -1.5px 3px", fontSize: "15px" }}
                  />
                </b>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container-fluid standard-pages">
      <div className="row ">
        <div className="col-md-4 col-sm-12 ">{userInfo()}</div>
        <div className="col-md-4 col-sm-12">
          <p>{userLinks()}</p>
        </div>
        <div className="col-md-4 col-sm-12"></div>
      </div>
    </div>
  );
};

export default Dashboard;
