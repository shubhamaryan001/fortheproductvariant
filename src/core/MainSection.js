import React, { Component } from "react";
import ReactPlayer from "react-player";

import { FiShoppingBag } from "react-icons/fi";
import { FaPlay, FaCheckCircle } from "react-icons/fa";
import { IoMdCloseCircle } from "react-icons/io";

import { Animated } from "react-animated-css";
import Typed from "react-typed";
import Newly from "./NewlyAdded";
import "../index.css";
import { Card, Icon } from "antd";
import "../../node_modules/react-modal-video/scss/modal-video.scss";
import ModalVideo from "react-modal-video";
import Slide from "react-reveal/Slide";
import HomeProduct from "./HomeProduct";
const { Meta } = Card;

export default class MainSection extends Component {
  constructor() {
    super();
    this.state = {
      isOpen: false
    };
    this.openModal = this.openModal.bind(this);
  }

  openModal() {
    this.setState({ isOpen: true });
  }
  render() {
    return (
      <>
        <div className="container-fluid main-page p-0">
          <div className="container" style={{ minWidth: "80%" }}>
            <div
              className="row"
              style={{ minHeight: "60vh", padding: "8rem 0 0 0" }}
            >
              <div className="col-md-6 ">
                <Slide duration={1500} left>
                  <div
                    className="overlay red"
                    style={{
                      position: "absolute",
                      top: "0",
                      left: "0"
                    }}
                  >
                    <img
                      style={{
                        width: "",
                        height: "50vh",
                        borderRadius: "50px 50px 50px 0 "
                      }}
                      className="img-fluid "
                      src="https://res.cloudinary.com/djnv06fje/image/upload/v1575181486/pricing-top_uouxge.jpg"
                    />
                  </div>

                  <div>
                    <ModalVideo
                      channel="youtube"
                      autoplay="1"
                      isOpen={this.state.isOpen}
                      videoId="EU0d67eNPTU"
                      onClose={() => this.setState({ isOpen: false })}
                    />
                    <button
                      style={{
                        position: "absolute",
                        width: "150px",
                        height: "50px",
                        top: "13rem",
                        left: "18rem",
                        margin: "0 auto",
                        borderRadius: "50px",
                        fontSize: "25px",
                        color: "black"
                      }}
                      className="btn btn-raised btn-light"
                      onClick={this.openModal}
                    >
                      <FaPlay
                        className="animated-button animated infinite"
                        style={{}}
                      />{" "}
                      Play
                    </button>
                  </div>
                </Slide>
              </div>
              <div className="col-md-6  " style={{ marginTop: "8rem" }}>
                <Slide duration={1500} right>
                  <h1 style={{ color: "white" }}>
                    Welcome to FloorPlanBazaar.com
                  </h1>
                  <div>
                    <h1 style={{ color: "white" }}>
                      <Typed
                        strings={["FLOOR PLAN'S AT ₹999"]}
                        typeSpeed={80}
                        backSpeed={50}
                        loop
                      ></Typed>
                    </h1>

                    <p className="animated flash  infinite text-muted">
                      <sup>*</sup> LIMITED TIME OFFER
                    </p>
                  </div>
                  <p>
                    WE'LL GET YOUR PROJECT DONE One stop solution for all your
                    needs.
                  </p>
                </Slide>
              </div>
            </div>
          </div>
          <img
            style={{ width: "100%" }}
            src="https://res.cloudinary.com/djnv06fje/image/upload/v1575180722/shap1_kq4gb9.png"
          ></img>
        </div>

        {/* ---------------------------------Sections------------------------------------ */}

        <HomeProduct />
      </>
    );
  }
}
