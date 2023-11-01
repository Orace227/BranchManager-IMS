import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Categories = () => {
  const [category, setCategory] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCategory = async () => {
    try {
      const Category = await axios.get('/GetCategory');
      if (Category) {
        const allCategories = Category.data.findCategories.map((category) => ({
          ...category,
          categoryImgPath: `http://localhost:4469/${category.categoryImgPath.replace('\\', '/')}`
        }));
        setCategory(allCategories);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategory();
  }, []);

  return (
    <section className="text-gray-600 body-font">
      <div className="container px-5 py-2 mx-auto">
        {loading ? (
          <p>Loading categories...</p>
        ) : category.length === 0 ? (
          <p className="text-4xl text-red-500 py-10">No category available!!!</p>
        ) : (
          <>
            <h1 className="text-3xl font-bold mb-4">Choose Category</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {category.map((product) => (
                <div key={product.id} className="bg-white rounded shadow-lg">
                  <Link to={`/BuyProducts/${product.categoryName}`}>
                    <a className="block relative h-48 rounded-t overflow-hidden">
                      <img alt="ecommerce" className="object-cover object-center w-full h-full" src={product.categoryImgPath} />
                    </a>
                    <div className="p-4">
                      <h2 className="text-gray-900 text-2xl font-medium">{product.categoryName}</h2>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Categories;
