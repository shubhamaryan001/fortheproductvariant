import React from "react";
import { FaRegCheckCircle, FaSkullCrossbones } from "react-icons/fa";
import { Animated } from "react-animated-css";
import { Link, withRouter } from "react-router-dom";

import "../index.css";

const NotFoundPage = () => {
  return (
    <div className="container-fluid standard-height  ">
      <div className="row">
        <div className="col-md-4"></div>
        <div className="col-md-4 " style={{ width: "100%" }}>
          <div className="card text-center ">
            <Animated
              animationIn="zoomIn"
              animationOut="zoomOut"
              animationInDuration={2000}
              animationInDelay={200}
              isVisible={true}
            >
              <FaSkullCrossbones
                className="mt-2"
                style={{ width: "100%", fontSize: "10rem", color: "red" }}
              />
            </Animated>
            <div class="card-body">
              <h1 class="card-title text-uppercase font-weight-bold">
                Not Found
              </h1>
            </div>

            <div class="card-body">
              <Link to="/" class="btn btn-success btn-raised ">
                Go To Home
              </Link>
            </div>
          </div>
        </div>
        <div className="col-md-4"></div>
      </div>
    </div>
  );
};

export default withRouter(NotFoundPage);
