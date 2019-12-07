import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import Menu from "./core/Menu";

import AboutUs from "./core/AboutUs";

const MobileRoutes = () => {
  return (
    <BrowserRouter>
      <Menu />
      <Switch>
        <Route
          path="/"
          exact
          component={() => {
            window.location.href = "https://ionic-app.now.sh";
            return null;
          }}
        />
      </Switch>
    </BrowserRouter>
  );
};

export default MobileRoutes;
