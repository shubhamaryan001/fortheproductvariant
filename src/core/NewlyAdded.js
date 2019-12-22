import React, { useState, useEffect, lazy, Suspense } from "react";
import { getProducts } from "./apiCore";
import Card from "./Card";
import { Link, Redirect } from "react-router-dom";
import ShowImage from "./ShowImage";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import "../index.css";
import { API } from "../config";
import Slide from "react-reveal/Slide";
const NewlyAdded = () => {
  const [productsByArrival, setProductsByArrival] = useState([]);
  const [error, setError] = useState(false);

  const [values, setValues] = useState({});
  const { loading } = values;
  const responsive = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 4000, min: 3000 },
      items: 4
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1
    }
  };
  const loadProductsByArrival = () => {
    getProducts("createdAt").then(data => {
      setValues({ loading: true });

      if (data.error) {
        setError(data.error);
        setValues({
          loading: false
        });
      } else {
        setProductsByArrival(data);
        console.log(data);
      }
    });
  };

  useEffect(() => {
    loadProductsByArrival();
  }, []);

  return (
    <>
      <div
        className="container-fluid  pb-5"
        style={{ minHeight: "60vh", background: "#F7F7F7" }}
      >
        <h2 className="text-center gredent-text">Trending Services</h2>
        <div className="row">
          <Slide duration={2500} left>
            <div className="col-md-10  pr-5 slide-trend">
              <Slide duration={2500} delay={2000} left>
                <div className="slide-trend-2"></div>
              </Slide>

              <Carousel
                swipeable={false}
                draggable={false}
                ssr={true}
                infinite={true}
                autoPlay={true}
                transitionDuration={1000}
                autoPlaySpeed={1000}
                responsive={responsive}
              >
                {productsByArrival &&
                  productsByArrival.length > 0 &&
                  productsByArrival.map((p, i) => {
                    return (
                      <div
                        key={i}
                        className="card"
                        style={{
                          maxWidth: "25rem",
                          maxHeight: "450px",
                          minHeight: "450px"
                        }}
                      >
                        <h4 className="card-header text-center text-uppercase">
                          {p.name}
                        </h4>
                        <img
                          className="img-top"
                          src={`${API}//product/photo/${p._id}`}
                          style={{ maxWidth: "100%", height: "225px" }}
                        />

                        <div className="p-3">
                          <p className="card-text">
                            {p.short_description.substring(0, 180)}
                          </p>

                          <div className="row">
                            <div className="col-md-4">
                              <h4>₹{p.price}</h4>
                            </div>
                            <div className="col-md-4"></div>
                            <div className="col-md-4">
                              <Link
                                className="btn btn-raised btn-info"
                                to={`/product/${p._id}`}
                              >
                                See Details
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </Carousel>
            </div>
          </Slide>

          <div className="col-md-2"></div>
        </div>
      </div>
    </>
  );
};

export default NewlyAdded;
