import React, { useState, useEffect } from "react";
import { Menu, Icon } from "antd";
import { Link, withRouter } from "react-router-dom";
const { SubMenu } = Menu;

const isActive = (history, path) => {
  if (history.location.pathname === path) {
    return { color: "#ff9900" };
  } else {
    return { color: "" };
  }
};
const SideBar = ({ history }) => {
  return (
    <Menu style={{ width: 230, minHeight: "100vh" }} mode="inline" color="dark">
      <div>
        <a className="navbar-brand" href="/">
          <img
            src="https://res.cloudinary.com/djnv06fje/image/upload/v1574864028/1_bsry6v.png"
            width="150"
            height="auto"
            class="d-inline-block align-top"
            alt=""
          />
        </a>
      </div>
      <Menu.Item key="1">
        <Link
          style={isActive(history, "/admin/dashboard-main")}
          to="/admin/dashboard-main"
        >
          <Icon type="pie-chart" />
          Dashboard
        </Link>
      </Menu.Item>

      <Menu.Item key="9">
        <Link style={isActive(history, "/admin/orders")} to="/admin/orders">
          <Icon type="dollar" theme="twoTone" /> Sales (Orders)
        </Link>
      </Menu.Item>
      <Menu.Item key="10">
        <Link style={isActive(history, "/admin/products")} to="/admin/products">
          <Icon type="shop" theme="twoTone" />
          Products
        </Link>
      </Menu.Item>
      <Menu.Item key="11">
        <Link style={isActive(history, "/admin/users")} to="/admin/users">
          <Icon type="idcard" theme="twoTone" />
          Customers
        </Link>
      </Menu.Item>
      <Menu.Item key="12">
        {" "}
        <Icon type="user" />
        Option 12
      </Menu.Item>
    </Menu>
  );
};
export default withRouter(SideBar);
