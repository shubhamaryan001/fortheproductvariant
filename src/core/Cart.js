import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getCart } from "./cartHelpers";
import Card from "./Card";
import Checkout from "./Checkout";
import { API } from "../config";
import { removeItem } from "./cartHelpers";
import "../index.css";
import { FaTrashAlt, FaTags } from "react-icons/fa";

const Cart = () => {
  const [items, setItems] = useState([]);
  const [run, setRun] = useState(false);
  const showRemoveProductButton = false;
  useEffect(
    () => {
      console.log("MAX DEPTH ...");
      setItems(getCart());
    },
    [run],
    [items]
  );

  const showItems = items => {
    return (
      <div>
        <h2>Your cart has {`${items.length}`} items</h2>
        <hr />
        {items.map((product, i) => (
          <Card
            key={i}
            product={product}
            showAddToCartButton={false}
            cartUpdate={true}
            showRemoveProductButton={true}
            setRun={setRun}
            run={run}
          />
        ))}
      </div>
    );
  };

  const noItemsMessage = () => (
    <div className="container-fluid">
      <h2>
        Your cart is empty. <br /> <Link to="/shop">Continue shopping</Link>
      </h2>
    </div>
  );

  return (
    <div className="container-fluid  text-center standard-pages  mt-5 ">
      <div className="container mt-5 card  p-3">
        <div className="row ">
          {items.length > 0 ? (
            <>
              <div className="container">
                {items.map((i, index) => {
                  return (
                    <>
                      <div
                        className="col-12 card mb-2 p-2"
                        style={{ borderRadius: "50px" }}
                      >
                        <div className="row">
                          <div className="col-md-2 ">
                            <img
                              src={`${API}/product/photo/${i._id}`}
                              className="rounded-circle "
                              style={{
                                maxWidth: "70px",
                                minWidth: "70px",
                                minHeight: "70px",
                                maxHeight: "70px",
                                objectFit: "cover",
                                margin: "0 auto"
                              }}
                            />
                          </div>
                          <div className="col-md-7 pt-3 text-center">
                            <Link to={`/product/${i._id}`}>
                              <h4>{i.name}</h4>
                            </Link>
                          </div>
                          <div className="col-md-3 pt-3 ">
                            <button
                              onClick={() => {
                                removeItem(i._id);
                                setRun(!run); // run useEffect in parent Cart
                              }}
                              className="btn btn-raised btn-danger "
                            >
                              Remove Product
                            </button>
                          </div>
                        </div>
                      </div>
                    </>
                  );
                })}
              </div>

              <div className="col-md-12">
                {/* <h2 className="mb-1">Your cart summary</h2> */}

                <Checkout products={items} setRun={setRun} run={run} />
              </div>
            </>
          ) : (
            noItemsMessage()
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
