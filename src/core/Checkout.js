import React, { useState, useEffect } from "react";
import { isAuthenticated } from "../auth";
import { Link } from "react-router-dom";
import { Redirect } from "react-router-dom";
import { getCoupon } from "../admin/apiAdmin";
import { FaAmazonPay } from "react-icons/fa";
import { createOrder } from "./apiCore";
import { emptyCart } from "./cartHelpers";
import { FiChevronsRight } from "react-icons/fi";
import { FaCreditCard, FaRegHandPointRight, FaTags } from "react-icons/fa";

import { razorPayOptionsDirt } from "./directpayhelp";
import { getUserBalance, deductUserWallet } from "../admin/apiAdmin";

import "../index.css";
let { user } = isAuthenticated();

const Razorpay = window.Razorpay;

const productTax = 50;
const Checkout = ({ products }) => {
  const [disabledbtn, setDisabledbtn] = useState(false);

  const [values, setValues] = useState({
    code: "",
    discount: 0,
    invalidCode: false,
    applied: false,
    redirectToReferrer: false
  });

  const [data, setData] = useState({
    note: ""
  });
  let {
    user: { _id, name, email, role, wallet_balance },
    token
  } = isAuthenticated();

  const [balc, setBalc] = useState({
    currentWalletBalance: wallet_balance
  });

  const userId = isAuthenticated() && isAuthenticated().user._id;

  const { currentWalletBalance } = balc;

  const { code, discount, applied, invalidCode, redirectToReferrer } = values;

  const getBalance = async event => {
    const currentBalance = await getUserBalance({ userId: _id });
    setBalc({
      ...balc,
      ["currentWalletBalance"]: currentBalance.user.wallet_balance
    });
  };

  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value });
  };

  const applyCode = () => {
    getCoupon({ code }).then(data => {
      if (data.success && data.coupon.isActive) {
        setValues({
          ...values,
          ["discount"]: data.coupon.discount,
          ["applied"]: true,
          ["invalidCode"]: false
        });
      } else {
        setValues({ ...values, ["invalidCode"]: true, ["applied"]: false });
      }
    });
  };

  const getTotal = () => {
    return products.reduce((currentValue, nextValue) => {
      return currentValue + nextValue.count * nextValue.price;
    }, 0);
  };

  const walletDeduct = async event => {
    event.preventDefault();
    // total amount to be paid for order
    let amount = applied ? getTotal() - discount : getTotal() + productTax;
    // deducting balance from user wallet
    const deductUserBalance = await deductUserWallet({
      token,
      userId: user._id,
      wallet: { amount: amount }
    });
    // if dedcuted get the current balance
    if (deductUserBalance.success) {
      const currentBalance = await getUserBalance({ userId: user._id });
      if (currentBalance.success) {
        user.wallet_balance = currentBalance.user.wallet_balance;
      }

      if (deductUserBalance.success) {
        const createOrderData = {
          products: products,
          name: "floorplanbazaar",
          transaction_id: "Undifine",
          amount: amount,
          payment_mode: "Wallet Payment",
          note: anyNote
        };

        await createOrder(userId, token, createOrderData)
          .then(response => {
            emptyCart(() => {
              setValues({
                redirectToReferrer: true
              });
            });
          })
          .catch(error => {
            console.log(error);
          });
      }
    }
  };

  const redirectUser = () => {
    if (redirectToReferrer) {
      return <Redirect to="/order/successfull" />;
    }
  };

  const redirectSuccess = () => {
    return <Redirect to="/order/successfull" />;
  };

  useEffect(() => {
    getBalance();
  }, []);

  const handleNote = event => {
    setData({ ...data, note: event.target.value });
  };
  let amount = applied
    ? getTotal() + productTax - discount
    : getTotal() + productTax;

  let FirstAmount = (25 / 100) * amount;
  let SecondAmount = (75 / 100) * amount;

  const walletCheckout = () => {
    if (disabledbtn === true) {
      return isAuthenticated() ? (
        <div>
          <FiChevronsRight className="FiChevronsRight" />
          <button
            onClick={walletDeduct}
            className="btn btn-raised btn-success"
            style={{ color: "#10dc60" }}
          >
            Pay using Wallet Money
          </button>
          <br />
          <span className="text-center">
            <p>
              Wallet balance Rs.{" "}
              <b>
                {currentWalletBalance ? `Rs. ${currentWalletBalance}` : "Rs. 0"}
              </b>
            </p>
          </span>
        </div>
      ) : (
        // <button className="btn btn-raised btn-success">Pay Now</button>
        <Link to="/signin">
          <button className="btn btn-raised btn-warning">
            Sign in to checkout
          </button>
        </Link>
      );
    } else if (disabledbtn === false) {
      return isAuthenticated() ? (
        <div>
          <FiChevronsRight className="FiChevronsRight" />
          <button
            onClick={walletDeduct}
            className="btn btn-raised btn-success"
            disabled
            style={{ color: "#10dc60" }}
          >
            Pay using Wallet Money
          </button>
          <br />
          <span className="text-center">
            <p>
              Wallet balance Rs.{" "}
              <b>
                {currentWalletBalance ? `Rs. ${currentWalletBalance}` : "Rs. 0"}
              </b>
            </p>
          </span>
        </div>
      ) : (
        // <button className="btn btn-raised btn-success">Pay Now</button>
        <Link to="/signin">
          <button className="btn btn-raised btn-warning">
            Sign in to checkout
          </button>
        </Link>
      );
    }
  };

  const getfilter = products.filter(
    (product, index, products) => product.category.name === "Floor Plan"
  );

  const showFilter = () => {
    if (getfilter.length > 0) {
      return <>Finded</>;
    } else {
      return <>Not Found</>;
    }
  };

  const handleCheck = event => {
    if (event.target.checked) {
      setDisabledbtn(true);
    } else {
      setDisabledbtn(false);
    }
  };
  const showCheckout = () => {
    if (disabledbtn === true) {
      return isAuthenticated() ? (
        <div>
          {console.log(products)}
          <FiChevronsRight className="FiChevronsRight" />

          <button
            onClick={openRzrPay}
            className="btn btn-raised btn-success"
            id="rzp-button1"
            style={{ background: "#10dc60" }}
          >
            Pay Now (₹ {FirstAmount})
          </button>
          {currentWalletBalance >
          (applied
            ? getTotal() + productTax - discount
            : getTotal() + productTax)
            ? walletCheckout()
            : ""}
        </div>
      ) : (
        // <button className="btn btn-raised btn-success">Pay Now</button>
        <Link to="/signin">
          <button className="btn btn-raised btn-warning">
            Sign in to checkout
          </button>
        </Link>
      );
    } else if (disabledbtn === false) {
      return isAuthenticated() ? (
        <div>
          {console.log(products)}
          <FiChevronsRight className="FiChevronsRight" />

          <button
            onClick={openRzrPay}
            className="btn btn-raised btn-success"
            id="rzp-button1"
            style={{ background: "#10dc60" }}
            disabled
          >
            Pay Now (₹ {FirstAmount})
          </button>
          {currentWalletBalance >
          (applied
            ? getTotal() + productTax - discount
            : getTotal() + productTax)
            ? walletCheckout()
            : ""}
        </div>
      ) : (
        // <button className="btn btn-raised btn-success">Pay Now</button>
        <Link to="/signin">
          <button className="btn btn-raised btn-warning">
            Sign in to checkout
          </button>
        </Link>
      );
    }
  };

  let anyNote = data.note;
  // Razorpay
  const rzp1 = new Razorpay(
    razorPayOptionsDirt(
      FirstAmount,
      user && user.name && user.email
        ? { ...user, token }
        : { name: "", email: "", mobile: "" },
      products,
      anyNote,
      SecondAmount
    )
  );
  const openRzrPay = event => {
    rzp1.open();
    event.preventDefault();
  };

  return (
    <div className="container text-center" style={{ maxWidth: "80%" }}>
      {/* <div className="text-center">
        <h2 className="mb-1 ">Your cart summary</h2>
        <hr />
      </div> */}

      <div className="row">
        <div className="col-md-12">
          <div className="card">
            <h3
              className="card-header p-1 "
              style={{ background: "#7044FF", color: "white" }}
            >
              Price Details <FaTags style={{ marginBottom: "-3px" }} />
            </h3>
            <div className="card-content">
              {applied ? (
                <>
                  <h5>
                    Complete Project Price <strike>₹{amount + discount}</strike>
                    <span style={{ marginLeft: "4px", color: "#10dc60" }}>
                      ₹{amount}
                    </span>
                  </h5>
                </>
              ) : (
                <>
                  <h4>Complete Project Price ₹{amount}</h4>
                </>
              )}

              <div className="row">
                <div className="col-6 text-right">
                  <h5 className="" style={{ color: "#10dc60" }}>
                    <FaRegHandPointRight className="icon-right-thumb" /> First
                    Payment 25% only
                  </h5>
                </div>
                <div className="col-6 text-center">
                  <h6 style={{ color: "#10dc60" }}>₹{FirstAmount}</h6>
                </div>
              </div>
              <div className="row">
                <div className="col-6 text-right">
                  <h5>Second Payment Remaining 75% </h5>
                </div>
                <div className="col-6 text-center">
                  <h6>
                    <b>₹{SecondAmount}</b>
                  </h6>
                </div>
              </div>

              <div className="row">
                <div className="col-6 text-right">
                  <h5 className="text-muted">GST</h5>
                </div>
                <div className="col-6 text-center">
                  <h6 className="text-muted">
                    <b>₹{productTax}</b>
                  </h6>
                </div>
              </div>
            </div>
            <div className="row code">
              <div className="col-6  ">
                <div className="p-2 text-center">
                  <b>
                    {invalidCode
                      ? "Invalid Coupon!"
                      : applied
                      ? `code applied successfully`
                      : ""}{" "}
                  </b>
                  <form class="form">
                    <input
                      placeholder="Apply Coupon"
                      type="text"
                      className="form__field"
                      onChange={handleChange("code")}
                      value={code}
                      autoFocus
                      required
                    />
                    <button
                      type="button"
                      onClick={applyCode}
                      class="btn btn--primary btn--inside uppercase"
                    >
                      Apply
                    </button>
                  </form>
                </div>

                <div className="row">
                  <div className="col-12">
                    <div className="text-center">
                      <div className="form-group p-0">
                        <textarea
                          rows="4"
                          onChange={handleNote}
                          className="form-control-checkout"
                          value={data.note}
                          placeholder="Type any Note ......"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-6 pt-5">
                <div className="form-group">
                  <label className="input-group">
                    <input
                      style={{ margin: "2.2px 2px 0 0" }}
                      type="checkbox"
                      onChange={handleCheck}
                    />
                    <p>
                      I have read and agree to the
                      <Link className="ml-1" to="/termsandcondition">
                        FloorPlanBazaar terms and conditions *
                      </Link>
                    </p>
                  </label>
                </div>

                {showCheckout()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    // <div className="container-fluid">
    //   <table>
    //     <tbody>
    //       <tr>
    //         <td>
    //           <p>
    //             {showFilter()}
    //             <a
    //               className="btn btn-raised"
    //               data-toggle="collapse"
    //               href="#collapseExample"
    //               role="button"
    //               aria-expanded="false"
    //               aria-controls="collapseExample"
    //             >
    //               Total Payable Amount: ₹{amount}
    //               <FaAmazonPay className="FaAmazonPay" />
    //             </a>
    //           </p>

    //           <div className="collapse" id="collapseExample">
    //             <div className="card card-body">
    //               <tr>
    //                 <td>
    //                   <b>Price Summary</b>
    //                 </td>
    //               </tr>
    //               <tr>
    //                 <td>
    //                   <div className="form-group">
    //                     <label className="text-muted">Apply Coupon</label>
    //                     <input
    //                       type="text"
    //                       className="form-control"
    //                       onChange={handleChange("code")}
    //                       value={code}
    //                       autoFocus
    //                       required
    //                     />
    //                   </div>
    //                   <button
    //                     onClick={applyCode}
    //                     className="btn btn-success active"
    //                   >
    //                     Apply Coupon
    //                   </button>{" "}
    //                 </td>
    //               </tr>
    //               <tr>
    //                 <td>
    //                   <b>
    //                     {invalidCode
    //                       ? "Invalid Coupon!"
    //                       : applied
    //                       ? `code applied successfully`
    //                       : ""}{" "}
    //                   </b>
    //                 </td>
    //               </tr>
    //               <tr>
    //                 <td>Total Product Price- </td>
    //                 <td>₹{getTotal()}</td>
    //               </tr>
    //               <tr>
    //                 <td> GST: </td>
    //                 <td>₹{productTax} </td>
    //               </tr>
    //               <tr>
    //                 <td> Discount: </td>
    //                 <td>₹{discount} </td>
    //               </tr>
    //               <tr>
    //                 <td> Total Amount= ₹ </td>
    //                 <td>{amount}</td>
    //               </tr>
    //             </div>
    //           </div>
    //         </td>
    //       </tr>
    //     </tbody>
    //   </table>
    //   <div className="gorm-group mb-3">
    //     <label className="text-muted">Any Note:</label>
    //     <textarea
    //       onChange={handleNote}
    //       className="form-control"
    //       value={data.note}
    //       placeholder="Type any Note ......"
    //     />
    //   </div>
    //   {redirectUser()}
    //   {showCheckout()}
    // </div>
  );
};

export default Checkout;
