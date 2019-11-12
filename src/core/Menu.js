import React from "react";
import { Link, withRouter } from "react-router-dom";
import { signout, isAuthenticated } from "../auth/index";
import { itemTotal } from "./cartHelpers";
import "../core/Menu.css";
import { FaUserCircle, FaHeadset } from "react-icons/fa";
import { MdMail } from "react-icons/md";

const isActive = (history, path) => {
  if (history.location.pathname === path) {
    return { color: "#ff9900" };
  } else {
    return { color: "#ffffff" };
  }
};

const { user } = isAuthenticated();

const Menu = ({ history }) => (
  <>
    <div className="container-fluid  m-0 p-0" id="desktopMenu">
      <div className="row nav-top-bar fixed-top bg-white">
        <div className="col-12">
          <div className="container">
            <ul className="item-inline float-right">
              <li className="list-inline-item">
                <a
                  href="email:support@floorplanbazaar.com"
                  style={{
                    color: "#FFC107"
                  }}
                >
                  <MdMail
                    style={{
                      color: "#FFC107",
                      marginRight: "5px",
                      marginBottom: "-3px"
                    }}
                  />
                  support@floorplanbazaar.com
                </a>
              </li>
              <li className="list-inline-item">
                <a
                  style={{
                    color: "#328FE4"
                  }}
                  href="tel: +91-9971997765"
                >
                  <FaHeadset
                    style={{
                      color: "#328FE4",
                      marginRight: "5px",
                      marginBottom: "-3px"
                    }}
                  />
                  +91-9971997765
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <nav className="navbar fixed-top  navbar-expand-lg bg-transparent mt-4 p-0">
        <div className="container">
          <a className="navbar-brand" href="/">
            <img
              src="https://www.shubhamaryan.com/wp-content/uploads/2019/11/1.png"
              width="150"
              height="auto"
              class="d-inline-block align-top"
              alt=""
            />
          </a>

          <ul className="navbar-nav  mr-auto">
            <li className="nav-item">
              <Link className="nav-link" style={isActive(history, "/")} to="/">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className="nav-link"
                style={isActive(history, "/shop")}
                to="/shop"
              >
                Shop
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className="nav-link"
                style={isActive(history, "/about-us")}
                to="/about-us"
              >
                About-Us
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="#contact">
                Support
              </Link>
            </li>
          </ul>
          {!isAuthenticated() && (
            <form className="form-inline my-2 my-lg-0">
              <Link
                to="/signin"
                className="btn btn-raised btn-success my-2 my-sm-0 mr-3 text-uppercase"
              >
                login
              </Link>{" "}
              <Link
                to="/signup"
                className="btn btn-info btn-raised my-2 my-sm-0 text-uppercase"
              >
                sign up
              </Link>
            </form>
          )}

          {isAuthenticated() && (
            <ul className="navbar-nav navdrop">
              <li className="nav-item  dropdown">
                <Link
                  className="nav-link btn btn-raised btn-primary dropdown-toggle"
                  to="#"
                  id="navbarDropdown"
                  role="button"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  <FaUserCircle className="FaUserCircle" />
                  {isAuthenticated().user.name}
                </Link>
                <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                  {isAuthenticated() && isAuthenticated().user.role === 0 && (
                    <li className="nav-item">
                      <Link className="dropdown-item" to="/user/dashboard">
                        Profile
                      </Link>
                    </li>
                  )}

                  {isAuthenticated() && isAuthenticated().user.role === 1 && (
                    <>
                      <li className="nav-item">
                        <Link className="dropdown-item" to="/admin/dashboard">
                          Admin Dashboard
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link className="dropdown-item" to="/user/dashboard">
                          User Dashboard Profile
                        </Link>
                      </li>
                      <Link className="dropdown-item" to="/admin/orders">
                        Manage Orders
                      </Link>
                    </>
                  )}

                  <Link className="dropdown-item" to="/user/dashboard/orders">
                    Orders
                  </Link>
                  <div className="dropdown-divider"></div>
                  <Link
                    className="dropdown-item"
                    onClick={() =>
                      signout(() => {
                        history.push("/");
                      })
                    }
                  >
                    Logout
                  </Link>
                </div>
              </li>
            </ul>
          )}
        </div>
      </nav>
    </div>
  </>
);

export default withRouter(Menu);
