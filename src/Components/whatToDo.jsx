import React, { useEffect, useState } from 'react';
import BrandCard from './brandCard';
import ThemeCategory from './themeCategory';
import categories from '../services/categories';
import { getProducts } from '../services/productService';
import Loader from './loader';
import { getUsers } from '../services/userService';
import { useTranslation } from 'react-i18next';



const WhatToDo = () => {
  const [currentCategory, setCurrentCategory] = useState('');
  const [bundles, setBundles] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  let delay = 0;
  
  const { t } = useTranslation();

  const getAllProducts = async () => {
    const { data } = await getProducts();
    const { data: userz } = await getUsers();
    setBrands(userz);

    var activeBundles = [];

    for (var i = 0; i < data.length; i++) {
      var currentBrand = {};

      for (var j = 0; j < userz.length; j++) {
        if (userz[j]._id === data[i].brandId) currentBrand = userz[j];
      }

      if (currentBrand.isActive) {
        if (new Date() - new Date(data[i].expiryDate) < 0)
          activeBundles.push(data[i]);

        currentBrand = {};
      }
    }

    setBundles(activeBundles);
    // setBundles(data);

    setLoading(false);
  };

  // const checkBrandActive = (userz, data) => {

  // };

  useEffect(() => {
    getAllProducts();
  }, []);

  const handleCategory = (cate) => {
    setCurrentCategory(cate);
  };

  const filteredBundles = () => {
    let filtered = bundles;

    if (currentCategory !== 'All' && currentCategory !== '') {
      filtered = bundles.filter((b) => b.category === currentCategory);
    }

    return filtered;
  };

  return (
    <div className='main-background'>
      <div className='whattodo-page'>
        <h1 className='whattodo-heading'>{t('WHAT TO DO')}</h1>

        <div className='theme-categories'>
          {categories.map((c) => (
            <ThemeCategory
              key={c}
              category={c}
              current={currentCategory}
              setCategory={handleCategory}
            />
          ))}
        </div>

        <div className='brandcards row'>
          {/* <BrandCard
            brand={{
              name: 'McDonalds',
              price: '245',
              img: '/img/img1.jpg',
              category: 'Food',
            }}
            delay={(delay += 0.1)}
          /> */}
          {loading ? (
            <Loader />
          ) : filteredBundles().length > 0 ? (
            filteredBundles().map((b) => (
              <BrandCard
                key={b._id}
                brand={b}
                mainBrand={brands.filter((br) => br._id === b.brandId)[0]}
                delay={(delay += 0.1)}
              />
            ))
          ) : (
            <div className='no-result'>
              <h2 className='no-result'>No result found!</h2>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WhatToDo;
