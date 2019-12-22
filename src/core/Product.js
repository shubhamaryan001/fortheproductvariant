import React, { useState, useEffect } from "react";
import { read, listRelated } from "./apiCore";
import { Link, Redirect } from "react-router-dom";
import { API } from "../config";
import { FaTags, FaCartPlus, FaRunning } from "react-icons/fa";
import { addItem } from "./cartHelpers";
import renderHTML from "react-render-html";
import ReactHtmlParser, {
  processNodes,
  convertNodeToElement,
  htmlparser2
} from "react-html-parser";
import ReactPlayer from "react-player";
import TermsConditions from "./TermsConditions";
import { Tag, Tabs } from "antd";
import ImageGallery from "react-image-gallery";
import Carousel from "react-bootstrap/Carousel";
import { GoFile } from "react-icons/go";

const { TabPane } = Tabs;
const Product = props => {
  let [product, setProduct] = useState({});
  const [price, setPrice] = useState();
  const [name, setName] = useState();
  const [relatedProduct, setRelatedProduct] = useState([]);
  const [error, setError] = useState(false);
  const [redirect, setRedirect] = useState(false);

  const loadSingleProduct = productId => {
    read(productId).then(data => {
      if (data.error) {
        setError(data.error);
      } else {
        setProduct(data);
        setPrice(data.price);
        setName(data.name);

        // fetch related products
        listRelated(data._id).then(data => {
          if (data.error) {
            setError(data.error);
          } else {
            setRelatedProduct(data);
          }
        });
      }
    });
  };

  function callback(key) {
    console.log(key);
  }

  const addToCart = () => {
    addItem(product, () => {
      setRedirect(true);
    });
  };
  const shouldRedirect = redirect => {
    if (redirect) {
      return <Redirect to="/cart" />;
    }
  };

  useEffect(() => {
    const productId = props.match.params.productId;
    loadSingleProduct(productId);
  }, [props]);

  const ProductImage = ({ item, url }) => (
    <div className="product-img text-center">
      <img
        src={`${API}/${url}/photo/${item._id}`}
        alt={item.name}
        className=" product-image mb-3"
        style={{
          maxHeight: "300px",
          maxWidth: "100%",
          objectFit: "cover"
        }}
      />
    </div>
  );

  const RelatedImage = ({ item, url }) => (
    <div className="product-img text-center">
      <img
        src={`${API}/${url}/photo/${item._id}`}
        alt={item.name}
        className=" product-image mb-3"
        style={{
          maxHeight: "150px",
          maxWidth: "auto",
          objectFit: "cover"
        }}
      />
    </div>
  );

  const RenderVariant = e => {
    e.preventDefault();
    let price = e.target.dataset.price;
    let area = e.target.dataset.area;
    setPrice(e.target.dataset.price);
    let newProduct = product;
    if (product.name.includes("variant")) {
      product.name = product.name.split("variant")[0].trim();
    }
    product.name = `${product.name} variant - ${area} sq. ft.`;
    setName(product.name);
    newProduct.variantSelected = area + "sq. ft.";
    newProduct.price = parseInt(price);
    setProduct(newProduct);
  };

  const showAddToCartButton = () => {
    return (
      <Link
        id="addcart"
        onClick={addToCart}
        className="btn btn-raised"
        style={{
          background: "#52c41a",
          borderRadius: "50px",
          fontWeight: "550",
          color: "white"
        }}
      >
        Buy Now
        <FaCartPlus
          style={{
            color: "white",
            fontSize: "20px",
            marginLeft: "5px",
            marginBottom: "-4px"
          }}
        />
      </Link>
    );
  };

  const showStock = quantity => {
    return quantity > 0 ? (
      <div>{showAddToCartButton()}</div>
    ) : (
      <span className="badge badge-danger badge-pill">Out of Stock</span>
    );
  };

  const showStockHurry = quantity => {
    if (quantity > 1 && quantity < 25) {
      return (
        <span className="badge badge-info badge-pill">
          <FaRunning />
          Limited Stock Hurry Up
          <FaRunning />
        </span>
      );
    }
  };

  const VideoShow = () => {
    if (product._id === "5de7b843438f401fbc563d3a") {
      return (
        <>
          <ReactPlayer
            url="https://www.youtube.com/embed/bhpKw3umAxE"
            className="react-player"
            width="100%"
            height="400px"
            controls
          />
        </>
      );
    } else if (product._id === "5debb2c7dfe05109846ed4ad") {
      return (
        <>
          <ReactPlayer
            url="https://www.youtube.com/watch?v=4B4PubjVquk"
            className="react-player"
            width="100%"
            height="400px"
            controls
          />
        </>
      );
    } else if (product._id === "5dcc1f0504510f454493aa72") {
      return (
        <>
          <ReactPlayer
            url="https://www.youtube.com/watch?v=c6pkHIrIgTI"
            className="react-player"
            width="100%"
            height="400px"
            controls
          />
        </>
      );
    }
  };

  const Slideshow = () => {
    return (
      <>
        <div className="row">
          <div className="col-md-12">
            <Carousel>
              <Carousel.Item>
                <img
                  className="card-img-top "
                  src="https://res.cloudinary.com/djnv06fje/image/upload/v1576928446/BASIC%20PIC/03_wxm2td.jpg"
                  alt="First slide"
                />
              </Carousel.Item>
              <Carousel.Item>
                <img
                  className="card-img-top "
                  src="https://res.cloudinary.com/djnv06fje/image/upload/v1576928445/BASIC%20PIC/04_yy9yoi.jpg"
                  alt="Third slide"
                />
              </Carousel.Item>
              <Carousel.Item>
                <img
                  className="card-img-top "
                  src="https://res.cloudinary.com/djnv06fje/image/upload/v1576928445/BASIC%20PIC/05_etj3hm.jpg"
                  alt="Third slide"
                />
              </Carousel.Item>
              <Carousel.Item>
                <img
                  className="card-img-top "
                  src="https://res.cloudinary.com/djnv06fje/image/upload/v1576928445/BASIC%20PIC/05_etj3hm.jpg"
                  alt="Third slide"
                />
              </Carousel.Item>
            </Carousel>
          </div>
        </div>

        <div className="row">
          <div className="col-md-12">
            <div className="pt-2   text-center ">
              <a
                href="https://res.cloudinary.com/djnv06fje/image/upload/v1576931353/BASIC%20PIC/03-converted_mowu6t.pdf"
                className="btn "
                target="_blank"
                style={{
                  borderRadius: "50px",
                  color: "black",
                  fontWeight: "600"
                }}
              >
                Complete File View
                <GoFile className="" style={{ margin: "0 0 -2px 5px" }} />
              </a>
            </div>
          </div>
        </div>
      </>
    );
  };

  const ShowShortPic = () => {
    if (product._id === "5de7b843438f401fbc563d3a") {
      return (
        <>
          <div
            className="container card bg-light  mt-2 p-2"
            style={{ boxShadow: "none" }}
          >
            <div className="row ">
              <div className="col-md-8">
                <h3 className="font-weight-bold">
                  <u>LIST OF DRAWINGS PROVIDED</u>
                </h3>

                <h5 className="font-weight-bold mt-4">
                  ✓ Floor Planning
                  <br />
                  <span className="ml-3" style={{ color: "#52C41A" }}>
                    (As Per Vaastu Norms)
                  </span>
                </h5>
                <h5 className="font-weight-bold mt-4">
                  ✓ Structure Drawings <br />
                  <span className="ml-3" style={{ color: "#52C41A" }}>
                    (Footing, Column, Beam, Lintel Slab, etc)
                  </span>
                </h5>
                <h5 className="font-weight-bold mt-4">
                  ✓ Electrical & Plumbing Layout
                </h5>
                <h5 className="font-weight-bold mt-4">✓ Door-Window Deisgns</h5>
                <h5 className="font-weight-bold mt-4">
                  ✓ Other Site Work Drawings
                </h5>
              </div>
              <div className="col-md-4">{Slideshow()}</div>
            </div>
          </div>
        </>
      );
    } else if (product._id === "5debb2c7dfe05109846ed4ad") {
      return (
        <>
          <div
            className="container card bg-light  mt-2 p-2"
            style={{ boxShadow: "none" }}
          >
            <div className="row ">
              <div className="col-md-8">
                <h3 className="font-weight-bold">
                  <u>LIST OF DRAWINGS PROVIDED</u>
                </h3>

                <h5 className="font-weight-bold mt-4">
                  ✓ Floor Planning
                  <br />
                  <span className="ml-3" style={{ color: "#52C41A" }}>
                    (As Per Vaastu Norms)
                  </span>
                </h5>
                <h5 className="font-weight-bold mt-4">
                  ✓ Structure Drawings <br />
                  <span className="ml-3" style={{ color: "#52C41A" }}>
                    (Footing, Column, Beam, Lintel Slab, etc)
                  </span>
                </h5>
                <h5 className="font-weight-bold mt-4">
                  ✓ Electrical & Plumbing Layout
                </h5>
                <h5 className="font-weight-bold mt-4">✓ Door-Window Deisgns</h5>
                <h5 className="font-weight-bold mt-4">
                  ✓ Other Site Work Drawings
                </h5>
              </div>
              <div className="col-md-4">{Slideshow()}</div>
            </div>
          </div>
        </>
      );
    } else if (product._id === "5dcc1f0504510f454493aa72") {
      return (
        <>
          <div
            className="container card bg-light  mt-2 p-2"
            style={{ boxShadow: "none" }}
          >
            <div className="row ">
              <div className="col-md-8">
                <h3 className="font-weight-bold">
                  <u>LIST OF DRAWINGS PROVIDED</u>
                </h3>

                <h5 className="font-weight-bold mt-4">
                  ✓ Floor Planning
                  <br />
                  <span className="ml-3" style={{ color: "#52C41A" }}>
                    (As Per Vaastu Norms)
                  </span>
                </h5>
                <h5 className="font-weight-bold mt-4">
                  ✓ Structure Drawings <br />
                  <span className="ml-3" style={{ color: "#52C41A" }}>
                    (Footing, Column, Beam, Lintel Slab, etc)
                  </span>
                </h5>
                <h5 className="font-weight-bold mt-4">
                  ✓ Front Elevation 3D Video Walkthru
                  <br />
                  <span className="ml-3" style={{ color: "#52C41A" }}>
                    (1 - 1.5 Min Walkthru Video of Front Elevation)
                  </span>
                </h5>
                <h5 className="font-weight-bold mt-4">
                  ✓ Electrical & Plumbing Layout
                </h5>
                <h5 className="font-weight-bold mt-4">✓ Door-Window Deisgns</h5>
                <h5 className="font-weight-bold mt-4">
                  ✓ Other Site Work Drawings
                </h5>
              </div>
              <div className="col-md-4">{Slideshow()}</div>
            </div>
          </div>
        </>
      );
    }
  };

  return (
    <div className="container-fluid pb-3">
      <div className="row standard-row-pages ">
        <div
          className="container-fluid product-back color mb-3"
          style={{
            backgroundImage: `url(${API}/product/photo/${product._id})`,
            minHeight: "60vh",
            objectFit: "contain"
          }}
        >
          <div className="row">
            <div className="col-md-12">
              <h1 className="text-gredient">{name}</h1>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            {shouldRedirect(redirect)}

            <div
              className="card "
              style={{
                backgroundColor: "#F1F3F5",
                width: "50rem",
                margin: "0 auto"
              }}
            >
              {/* <img
                class="card-img-top"
                src={`${API}/product/photo/${product._id}`}
                alt={product.name}
                style={{ maxHeight: "450px" }}
              /> */}
              <div className="p-2">
                <h4 className="text-left font-weight-bold">{name}</h4>
                <div className="container text-center">
                  <h4 className="text-muted">Please Select Area Size</h4>
                  <div className="row">
                    {product.variants &&
                      product.variants.length > 0 &&
                      product.variants.map((item, index) => (
                        <>
                          <div key={index} className="col-md-3 mb-2">
                            <Tag
                              color="#2db7f5"
                              // id={item.price}
                              data-area={item.area}
                              data-price={item.price}
                              style={{ textTransform: "uppercase" }}
                              onClick={RenderVariant}
                              style={{ cursor: "pointer" }}
                            >
                              AREA UPTO {item.area} Sq.Ft.
                            </Tag>
                          </div>
                        </>
                      ))}
                  </div>

                  <div className="row">
                    <div className="col-md-12">
                      <div className="row mt-3">
                        <div className="col-6">
                          <p
                            className="text-center pt-3"
                            style={{ float: "right" }}
                          >
                            <h3>
                              Price : ₹{price}
                              <FaTags style={{ color: "#4CAF50" }} />
                            </h3>
                            <p className="black-9" style={{ float: "right" }}>
                              <b>
                                Category:
                                {product.category && product.category.name}
                              </b>
                            </p>
                          </p>
                        </div>
                        <div className="col-6 ">
                          <div style={{ margin: "0 auto" }}>
                            {showStockHurry(product.quantity)}
                            {showStock(product.quantity)}
                          </div>
                        </div>

                        <hr />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {ShowShortPic()}
            </div>

            <div className="container-fluid mt-5">
              <div
                className="card p-2"
                style={{ background: "#F1F3F5", margin: "0 auto" }}
              >
                <h2
                  className="text-center "
                  style={{
                    textTransform: "uppercase",
                    color: "#F1C30F",
                    fontWeight: "800"
                  }}
                >
                  Related products
                </h2>
                <div className="row ">
                  {relatedProduct.map((p, i) => (
                    <div key={i} className="col-md-6 mb-3">
                      <div
                        className="card text-center"
                        style={{
                          width: "22rem",
                          minHeight: "500px",
                          maxHeight: "500px",
                          margin: "0 auto"
                        }}
                      >
                        <img
                          class="card-img-top"
                          src={`${API}/product/photo/${p._id}`}
                          alt={product.name}
                          style={{ maxHeight: "250px", minHeight: "250px" }}
                        />
                        <div className="p-2">
                          <h3 class="card-title">
                            <b>{p.name}</b>
                          </h3>
                          <div class="card-text">
                            {renderHTML(p.short_description.substring(0, 185))}
                            <Link to={`/product/${p._id}`}>:-Read More</Link>
                          </div>

                          <h4>
                            <span className="text-muted">Starting At</span> ₹
                            {p.price}
                          </h4>
                          <div className="row mt-3">
                            <div className="col-md-6">
                              {showAddToCartButton()}
                            </div>

                            <div className="col-md-6">
                              <Link to={`/product/${p._id}`}>
                                <span
                                  style={{
                                    fontWeight: "600",
                                    color: "rgb(49, 70, 89)",
                                    fontSize: "16px"
                                  }}
                                >
                                  View Product
                                </span>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6 ">
            <Tabs className="p-3 " onChange={callback} type="card">
              <TabPane tab="Details" key="1">
                <div
                  className="card p-3"
                  style={{ margin: "0 auto", width: "55rem" }}
                >
                  <div className="mb-2">{VideoShow()}</div>
                  <p>{ReactHtmlParser(product.description)}</p>
                </div>
              </TabPane>
              <TabPane tab="Terms & Conditions" key="2">
                <div classNames="row">
                  <div className="col-md-12">
                    <TermsConditions />
                  </div>
                </div>
              </TabPane>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
