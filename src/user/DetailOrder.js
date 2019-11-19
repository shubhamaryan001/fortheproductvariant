import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";
import { isAuthenticated } from "../auth";
import { Link, Redirect } from "react-router-dom";
import { getSingleOrder } from "../admin/apiAdmin";
import { updateOrderCancelled } from "../user/apiUser";
import moment from "moment";
import { Timeline, Modal, Icon, Button } from "antd";

import "../index.css";

import { FaNetworkWired } from "react-icons/fa";

const { confirm } = Modal;

const DetailOrder = props => {
  const [time, setTime] = useState(false);

  const [order, setOrder] = useState({});
  const [error, setError] = useState(false);
  const { user, token } = isAuthenticated();
  const [values, setValues] = useState({
    redirectToReferrer: false
  });

  const { redirectToReferrer } = values;
  const cancel = true;

  const loadSingleOrder = orderId => {
    getSingleOrder(orderId, user._id, token).then(data => {
      if (data.error) {
        setError(data.error);
      } else {
        console.log(data);
        setOrder(data);
      }
    });
  };

  const handleOrderCancelled = orderId => {
    let { user, token } = isAuthenticated();
    updateOrderCancelled(user._id, token, order._id, cancel).then(data => {
      if (data.error) {
        console.log("Status update failed");
      } else {
        console.log("order has been Cancelled");
        setValues({
          redirectToReferrer: false
        });
        loadSingleOrder(order._id, user._id, token);
      }
    });
  };

  const contentcancel = () => {
    return (
      <div>
        <p>
          If your Request accepted refund Will initiated within 24hrs. So please
          be patience till 24hrs. After that u will come to support
        </p>
      </div>
    );
  };
  function showConfirm() {
    confirm({
      title: "Do you Want to Cancel these Project?",
      content: contentcancel(),
      onOk() {
        handleOrderCancelled();
      },
      onCancel() {
        console.log("Cancel");
      }
    });
  }

  useEffect(() => {
    loadSingleOrder();
    const orderId = props.match.params.orderId;
    loadSingleOrder(orderId, user._id, token);
  }, [props]);

  var tomorrow = moment(order.createdAt).add(4, "hours");

  var Today = moment();

  const showButton = () => {
    if (Today < tomorrow) {
      return (
        <>
          <Button type="danger" onClick={showConfirm} shape="round" icon="stop">
            Cancel Project
          </Button>
        </>
      );
    } else {
      return (
        <>
          <Button
            disabled
            type="danger"
            onClick={showConfirm}
            shape="round"
            icon="stop"
          >
            Cancel Project
          </Button>
          <br />
          <small>
            <sup>Under 4 Hrs from ordered is over</sup>
          </small>
        </>
      );
    }
  };
  console.log(Today);
  console.log(tomorrow);

  const redirectUser = () => {
    if (redirectToReferrer) {
      return <Redirect to="/order/successfull" />;
    }
  };

  return (
    <div className="container-fluid" style={{ minHeight: "80vh" }}>
      {redirectUser()}
      <div className="row">
        <div className="col-4">
          <div className="card">
            <h4 className="card-header">
              {" "}
              <FaNetworkWired
                style={{
                  color: "#FFC107",
                  marginRight: "5px",
                  marginBottom: "-4px"
                }}
              />
              Order Status
            </h4>
            <div className="container m-2">
              {order.cancelled === false ? (
                <>
                  <Timeline>
                    {order.placed_order === true ? (
                      <Timeline.Item
                        color="green"
                        dot={
                          <Icon
                            type="check-circle"
                            theme="twoTone"
                            twoToneColor="#52c41a"
                          />
                        }
                      >
                        <div className="badge badge-pill">
                          Order Confirmed We Just Received Rs.{order.amount}
                        </div>
                        {order.products.map((p, i) => (
                          <div key={i} className="card">
                            For the Package
                            <span>{p.name}</span>
                          </div>
                        ))}
                      </Timeline.Item>
                    ) : (
                      <Timeline.Item color="red" dot={<Icon type="loading" />}>
                        Not Yet Confirmed
                      </Timeline.Item>
                    )}

                    {order.processing === true ? (
                      <Timeline.Item
                        color="green"
                        dot={
                          <Icon
                            type="check-circle"
                            theme="twoTone"
                            twoToneColor="#52c41a"
                          />
                        }
                      >
                        Order is Processing
                      </Timeline.Item>
                    ) : (
                      <Timeline.Item color="red" dot={<Icon type="loading" />}>
                        Not Yet Process
                      </Timeline.Item>
                    )}

                    {order.underconstruction === true ? (
                      <Timeline.Item
                        color="green"
                        dot={
                          <Icon
                            type="check-circle"
                            theme="twoTone"
                            twoToneColor="#52c41a"
                          />
                        }
                      >
                        Order Goes Under Construction
                      </Timeline.Item>
                    ) : (
                      <Timeline.Item color="red" dot={<Icon type="loading" />}>
                        Not Yet Goes Under Construction
                      </Timeline.Item>
                    )}

                    {order.ready === true ? (
                      <Timeline.Item
                        color="green"
                        dot={
                          <Icon
                            type="check-circle"
                            theme="twoTone"
                            twoToneColor="#52c41a"
                          />
                        }
                      >
                        Order is Ready
                      </Timeline.Item>
                    ) : (
                      <Timeline.Item color="red" dot={<Icon type="loading" />}>
                        Not Yet Ready
                      </Timeline.Item>
                    )}

                    {order.finished === true ? (
                      <Timeline.Item
                        color="green"
                        dot={
                          <Icon
                            type="check-circle"
                            theme="twoTone"
                            twoToneColor="#52c41a"
                          />
                        }
                      >
                        Order has been Finished
                      </Timeline.Item>
                    ) : (
                      <Timeline.Item
                        dot={<Icon type="clock-circle" theme="filled" />}
                      >
                        Not Yet Finished
                      </Timeline.Item>
                    )}
                  </Timeline>
                  {order.cancelled === false ? (
                    <>
                      <ul className="list-inline">
                        <li className="list-inline-item">{showButton()}</li>
                        {/* {time ? (
                          <>
                            <li className="list-inline-item">
                              <Button
                                type="danger"
                                onClick={showConfirm}
                                shape="round"
                                icon="stop"
                              >
                                Cancel Project
                              </Button>
                            </li>
                          </>
                        ) : (
                          <>Not Able to cancel</>
                        )} */}
                        <li className="list-inline-item">
                          <div>
                            <a
                              className="btn btn-success btn-raised"
                              href={order.fileLink}
                              target="_blank"
                            >
                              {" "}
                              download
                            </a>
                          </div>
                        </li>
                      </ul>
                    </>
                  ) : (
                    <h6>
                      If Request accepted refund Will initiated within 24hrs.So
                      please be patience till 24hrs after that u will come to
                      support
                    </h6>
                  )}

                  {order.ready === true ? (
                    <>
                      {order.secondpayment === false ? (
                        <>
                          <button>{order.secondpaymentamount}</button>
                        </>
                      ) : (
                        ""
                      )}
                    </>
                  ) : (
                    ""
                  )}
                </>
              ) : (
                <h6>
                  If Request accepted refund Will initiated within 24hrs.So
                  please be patience till 24hrs after that u will come to
                  support
                </h6>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailOrder;
