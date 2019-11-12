import React, { useState, useEffect, Component } from "react";
import { isAuthenticated } from "../auth";
import { createProduct, getCategories } from "./apiAdmin";
import { Link } from "react-router-dom";
import ReactQuill, { Quill } from "react-quill"; // ES6
import { EditorState } from "draft-js";
import CKEditor from "react-ckeditor-component";
import "../index.css";
import { Editor } from "@tinymce/tinymce-react";

export default class AddProduct extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      short_description: "",
      description: "",
      price: "",
      categories: [],
      category: "",
      shipping: "",
      quantity: "",
      photo: "",
      variants: [
        {
          price: "",
          area: "" //change this to other key
        }
      ],
      loading: false,
      error: "",
      createdProduct: "",

      redirectToProfile: false,
      formData: ""
    };
  }

  componentDidMount() {
    getCategories().then(data => {
      if (data.error) {
        this.setState({
          error: data.error
        });
      } else {
        this.setState({
          categories: data,
          formData: new FormData()
        });
      }
    });
  }

  handleVariantChange = event => {
    const target = event.target;
    const value = target.value;
    const id = target.id;
    const key = target.name;

    const clone = Object.assign({}, this.state);
    clone.variants[id][key] = value;
    this.state.formData.set("variants", JSON.stringify(clone.variants));
    this.setState(clone);
  };
  handleChange = name => event => {
    const value = name === "photo" ? event.target.files[0] : event.target.value;
    this.state.formData.set(name, value);
    this.setState({ [name]: value });
  };

  handleChangeDescription = e => {
    const value = e.target.getContent();
    console.log(value);
    this.state.formData.set("description", value);
    this.setState({ description: value });

    console.log({ description: value });
  };

  // handleChangeDescription = e => {
  //   console.log(e);
  //   console.log(e);
  //   this.state.formData.set("description", e);
  //   this.setState({ description: e });
  // };

  // // onChange = (description, e) => {
  // //   console.log(e);
  // //   this.state.formData.set("description", e);
  // //   this.setState({
  // //     description: e
  // //   });

  //   console.log(description);
  // };

  clickSubmit = event => {
    event.preventDefault();
    this.setState({ error: "", loading: true });
    let { user, token } = isAuthenticated();

    let { formData } = this.state;

    createProduct(user._id, token, formData).then(data => {
      if (data.error) {
        this.setState({ error: data.error });
      } else {
        this.setState({
          name: "",
          short_description: "",
          description: "",
          photo: "",
          price: "",
          quantity: "",
          variants: [
            {
              price: "",
              area: ""
            }
          ],
          loading: false,
          createdProduct: data.name
        });
      }
    });
  };

  addVariant = e => {
    e.preventDefault();
    const variantJson = {
      price: "",
      area: "" //change this to other key
    };

    let clone = Object.assign({}, this.state);
    clone.variants = [...clone.variants, variantJson];

    this.setState(clone);
  };

  descriptionForm = () => {
    const {
      short_description,

      description,
      editorState
    } = this.state;

    return (
      <>
        <div className="form-group">
          <label className="text-muted">Short Description</label>
          <textarea
            onChange={this.handleChange("short_description")}
            type="text"
            className="form-control"
            value={short_description}
          />
        </div>

        <Editor
          value={description}
          init={{
            height: 500,
            menubar: false,
            plugins: [
              "advlist autolink lists link image charmap print preview anchor emoticons image editimage",
              "searchreplace visualblocks code fullscreen",
              "insertdatetime media table paste code help wordcount"
            ],
            toolbar:
              "undo redo | formatselect | bold italic backcolor | \
             alignleft aligncenter alignright alignjustify | \
             bullist numlist outdent indent | removeformat |anchor|fullscreen|emoticons|image|numlist |bullist |help"
          }}
          onChange={this.handleChangeDescription}
        />
      </>
    );
  };

  newPostForm = () => {
    let {
      name,
      short_description,
      description,
      price,
      categories,
      category,
      shipping,
      quantity,
      photo,
      loading,
      error,
      createdProduct,
      redirectToProfile,
      formData
    } = this.state;
    return (
      <form className="mb-3" onSubmit={this.clickSubmit}>
        <h4>Post Photo</h4>
        <div className="form-group">
          <label className="btn btn-secondary">
            <input
              onChange={this.handleChange("photo")}
              type="file"
              name="photo"
              accept="image/*"
            />
          </label>
        </div>
        <div className="form-group">
          <label className="text-muted">Name</label>
          <input
            onChange={this.handleChange("name")}
            type="text"
            className="form-control"
            value={this.state.name}
          />
        </div>

        <div className="form-group">
          <label className="text-muted">Price</label>
          <input
            onChange={this.handleChange("price")}
            type="number"
            className="form-control"
            value={price}
          />
        </div>
        <div className="form-group">
          <label className="text-muted">Category</label>
          <select
            onChange={this.handleChange("category")}
            className="form-control"
          >
            <option>Please select</option>
            {categories &&
              categories.map((c, i) => (
                <option key={i} value={c._id}>
                  {c.name}
                </option>
              ))}
          </select>
        </div>
        <div className="form-group">
          <label className="text-muted">Shipping</label>
          <select
            onChange={this.handleChange("shipping")}
            className="form-control"
          >
            <option>Please select</option>
            <option value="0">No</option>
            <option value="1">Yes</option>
          </select>
        </div>
        <div className="form-group">
          <label className="text-muted">Quantity</label>
          <input
            onChange={this.handleChange("quantity")}
            type="number"
            className="form-control"
            value={quantity}
          />
        </div>
        {this.state.variants.map((item, index) => (
          <div key={index}>
            {console.log(item)}
            {Object.keys(item).map((i, e) => (
              <div>
                <div className="form-group">
                  <label className="text-muted">{i}</label>
                  <input
                    onChange={this.handleVariantChange}
                    type="number"
                    name={i}
                    id={index}
                    className="form-control"
                    value={this.state.variants[index][i]}
                  />
                </div>
              </div>
            ))}
          </div>
        ))}

        <button className="btn btn-success active" onClick={this.addVariant}>
          Add Variant
        </button>
        <button className="btn btn-success active">Create Product</button>
        <Link to="/admin/dashboard" className="btn btn-warning active ml-5">
          Back to Dashboard
        </Link>
      </form>
    );
  };

  showError = () => (
    <div
      className="alert alert-danger"
      style={{ display: this.state.error ? "" : "none" }}
    >
      {this.state.error}
    </div>
  );

  showSuccess = () => (
    <div
      className="alert alert-info"
      style={{ display: this.state.createdProduct ? "" : "none" }}
    >
      <h2>{`${this.state.createdProduct}`} is created!</h2>
    </div>
  );

  showLoading = () =>
    this.state.loading && (
      <div className="alert alert-info">
        <img
          src="https://www.shubhamaryan.com/wp-content/uploads/2019/09/Loading.gif"
          alt=""
        />
      </div>
    );
  render() {
    let {
      name,
      description,
      price,
      categories: [],
      category,
      shipping,
      quantity,
      photo,
      loading,
      error,
      createdProduct,
      redirectToProfile,
      formData
    } = this.state;
    return (
      <div className="container-fluid p-3 signup ">
        <div className="row ">
          <div className="card col-md-4 col-sm-12">
            {this.showLoading()}
            {this.showSuccess()}
            {this.showError()}
            {this.newPostForm()}
          </div>
          <div className="col-md-8 col-sm-12">{this.descriptionForm()}</div>
        </div>
      </div>
    );
  }
}

AddProduct.modules = {
  toolbar: [
    [{ header: "1" }, { header: "2" }, { header: [3, 4, 5, 6] }, { font: [] }],

    [{ color: [] }],
    [{ size: [] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link", "image", "video"],
    ["clean"],
    ["code-block"]
  ]
};

AddProduct.formats = [
  "header",
  "color",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "link",
  "image",
  "video",
  "code-block"
];
