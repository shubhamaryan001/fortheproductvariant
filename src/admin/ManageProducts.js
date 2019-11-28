import React, { useState, useEffect } from "react";
import { isAuthenticated } from "../auth";
import { Link } from "react-router-dom";
import { getProducts, deleteProduct } from "./apiAdmin";
import SideBar from "./SideBar";

const ManageProducts = () => {
  const [products, setProducts] = useState([]);

  const { user, token } = isAuthenticated();

  const loadProducts = () => {
    getProducts().then(data => {
      if (data.error) {
        console.log(data.error);
      } else {
        setProducts(data);
      }
    });
  };
  const destroy = productId => {
    deleteProduct(productId, user._id, token).then(data => {
      if (data.error) {
        console.log(data.error);
      } else {
        loadProducts();
      }
    });
  };

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <div className="wrapper">
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-2">
            <SideBar />
          </div>
          <div className="col-md-10">
            <h2 className="text-center">Total {products.length} products</h2>

            <div className="card">
              <ul className="list-group">
                {products.map((p, i) => (
                  <li key={i} className="list-group-item">
                    <strong>{p.name}</strong>
                    <Link to={`/admin/product/update/${p._id}`}>
                      <button className="btn btn-raised btn-info">
                        Update
                      </button>
                    </Link>
                    <button
                      onClick={() => destroy(p._id)}
                      className="btn btn-raised btn-danger"
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageProducts;
