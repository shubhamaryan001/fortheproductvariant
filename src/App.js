import React, { Component } from "react";
import Routes from "./Routes";
import MobileRoutes from "./MobileRoutes";
import withSizes from "react-sizes";
import { Redirect } from "react-router-dom";

class App extends Component {
  render() {
    return <div>{this.props.isMobile ? <MobileRoutes /> : <Routes />}</div>;
  }
}

const mapSizesToProps = ({ width }, { mobileBreakpoint }) => ({
  isMobile: width < 1080
});

export default withSizes(mapSizesToProps)(App);
