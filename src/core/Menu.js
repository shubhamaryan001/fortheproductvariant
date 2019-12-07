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
  <nav className="navbar fixed-top  navbar-expand-lg bg-light">
    <div className="container">
      <a className="navbar-brand" href="/">
        <img
          src="https://res.cloudinary.com/djnv06fje/image/upload/v1574864028/1_bsry6v.png"
          width="150"
          height="auto"
          class="d-inline-block align-top"
          alt=""
        />
      </a>

      <ul className="navbar-nav  mr-auto">
        <li className="nav-item cool-link">
          <Link className="nav-link" style={isActive(history, "/")} to="/">
            Home
          </Link>
        </li>
        <li className="nav-item ">
          <Link
            className="nav-link cool-link"
            style={isActive(history, "/shop")}
            to="/shop"
          >
            Shop
          </Link>
        </li>
        <li className="nav-item">
          <Link
            className="nav-link cool-link"
            style={isActive(history, "/about-us")}
            to="/about-us"
          >
            About Us
          </Link>
        </li>

        <li className="nav-item">
          <Link className="nav-link cool-link" to="#contact">
            Support
          </Link>
        </li>
      </ul>
      {!isAuthenticated() && (
        <form className="form-inline my-2 my-lg-0">
          <Link
            to="/signin"
            className="btn btn-raised btn-login  my-2 my-sm-0 mr-3 text-uppercase"
          >
            login
          </Link>
          <Link
            to="/signup"
            className="btn btn-signup btn-raised my-2 my-sm-0 text-uppercase"
          >
            sign up
          </Link>
        </form>
      )}

      {isAuthenticated() && (
        <ul className="navbar-nav navdrop">
          <li className="nav-item  dropdown">
            <Link
              className="nav-link btn btn-raised  btn-danger dropdown-toggle"
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
);

export default withRouter(Menu);
