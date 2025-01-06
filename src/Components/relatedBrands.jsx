import React from 'react';
import Loader from './loader';
import BrandCard from './brandCard';

const RelatedBrands = ({ loading, bundles, brands, delay, t }) => {
  return (
    <>
      {loading ? (
        <Loader />
      ) : bundles.length > 0 ? (
        <div className='related-brands'>
          <div className='linee'></div>
          <h2 className='related-h2'>{t('Related Bundles')}</h2>

          <div className='row'>
            {bundles.map((b) => (
              <BrandCard
                key={b._id}
                mainBrand={brands.filter((br) => br._id === b.brandId)[0]}
                brand={b}
                delay={(delay += 0.1)}
              />
            ))}
            {/* : (
          <div className='no-result'>
            <h2 className='no-result'>No related brands found!</h2>
          </div>
        )} */}
          </div>
        </div>
      ) : null}
    </>
  );
};

export default RelatedBrands;
