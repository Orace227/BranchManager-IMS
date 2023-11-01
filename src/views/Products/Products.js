import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
// import photo from './catagory_photo.jpg';

import { syncCartWithDatabase } from 'EndPoints/CreateOrder';
import axios from 'axios';

const Products = () => {
  const { category } = useParams();
  const [cartUpdated, setCartUpdated] = useState(null); // Initialize a state variable
  console.log(cartUpdated);
  const isProductInCart = (product) => {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    return cart.some((item) => item.productId === product.productId);
  };

  const [products, setProducts] = useState([]);

  const fetchCategory = async () => {
    try {
      const Products = await axios.get('/GetProducts');
      if (Products) {
        console.log(Products.data.findProducts);

        const allProducts = Products.data.findProducts.map((product) => ({
          ...product,
          productImgPath: `http://localhost:4469/${product.productImgPath.replace('\\', '/')}`
        }));
        setProducts(allProducts);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchCategory();
  }, []);

  const handleAddToCart = (product) => {
    // Get the current cart from local storage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Check if the product is already in the cart
    const isProductInCartLocal = cart.some((item) => item.productId === product.productId);

    if (isProductInCartLocal) {
      // If the product is already in the cart, remove it
      cart = cart.filter((item) => item.productId !== product.productId);
    } else {
      // If the product is not in the cart, add it
      cart.push(product);
    }

    // Update the local storage with the modified cart
    localStorage.setItem('cart', JSON.stringify(cart));

    // Set the state variable to trigger a re-render
    setCartUpdated(new Date().getTime());
  };

  useEffect(() => {
    // Get the current cart from local storage
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    syncCartWithDatabase(cart);
  }, []);

  // Filter the product data based on the category
  const filteredProducts = category ? products.filter((product) => product.category === category) : products;

  return (
    <section className="text-gray-600 body-font">
      {filteredProducts.length > 0 && <h1 className="text-3xl font-bold mb-2">Choose Products</h1>}

      <div className="container mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2">
          {filteredProducts.length > 0 ? ( // Check if there are filtered products
            filteredProducts.map((product) => (
              <div key={product.productId} className="bg-white rounded shadow-lg p-4 m-3">
                <div className="flex flex-col sm:flex-row">
                  <div className="w-full sm:w-1/2 mb-4 sm:mb-0">
                    <Link to={`/BuyProducts/${product.category}`}>
                      <img alt="ecommerce" className="object-cover object-center w-full h-48 rounded-t" src={product.productImgPath} />
                    </Link>
                  </div>
                  <div className="w-full sm:w-1/2 pl-4 my-auto">
                    <h2 className="text-gray-900 text-3xl font-medium">{product.productName}</h2>
                    <p className="text-gray-400 text-lg">{product.description}</p>
                    <button
                      onClick={() => handleAddToCart(product)}
                      className={`bg-blue-500 text-white py-2 px-4 rounded-full mt-4 hover:bg-blue-600 shadow-md transform transition-transform duration-300${
                        isProductInCart(product) ? ' scale-105' : ''
                      }`}
                    >
                      {isProductInCart(product) ? 'Added to Cart' : 'Add to Cart'}
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div>
              <p className="my-10 text-3xl text-red-500">Products are not available!!!</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Products;
