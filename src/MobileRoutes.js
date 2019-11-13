import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import Menu from "./core/Menu";
import MobileMenu from "./core/MobileMenu";

import AboutUs from "./core/AboutUs";

const MobileRoutes = () => {
  return (
    <BrowserRouter>
      <MobileMenu />
      <Menu />
      <Switch>
        <Route
          path="/"
          exact
          component={() => {
            window.location.href = "https://floorplanbazaar.com";
            return null;
          }}
        />
      </Switch>
    </BrowserRouter>
  );
};

export default MobileRoutes;
