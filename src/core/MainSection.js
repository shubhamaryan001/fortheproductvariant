import React from "react";
import { FiShoppingBag } from "react-icons/fi";
import { Animated } from "react-animated-css";
import Typed from "react-typed";

import "../index.css";

const MainSection = () => {
  return (
    <div className="container-fluid bg-warning">
      <div className="row">
        <div className="col-lg-6 col-md-6 col-sm-12">
          <h1>
            <Typed
              strings={["Here you can find anything", "FloorPlanBazaar.com"]}
              typeSpeed={40}
              backSpeed={50}
              loop
            />
          </h1>
        </div>
        <div className="col-lg-6 col-md-6 col-sm-12"></div>
      </div>
    </div>
  );
};

export default MainSection;
