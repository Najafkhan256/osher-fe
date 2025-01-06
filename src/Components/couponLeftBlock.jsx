import React from 'react';
import Slider from 'react-slick';

const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
};

const CouponLeftBlock = ({ brand, t }) => {
  return (
    <>
      <Slider {...settings}>
        {brand.img.map((b) => (
          <div className='coupon-page-carousel' key={b}>
            <div className='coupon-page-carousel-2'>
              <img src={b} alt='Brand' width='100%' />
            </div>
          </div>
        ))} 
      </Slider>

      <div className='coupon-details'>
        <h3>{t('About this deal')}</h3>
        <p>{brand.details}</p>

        <h3>{t('Need to know')}</h3>
        <p>{brand.description}</p>

        <h3>{t('Branches')}</h3>
        {brand.branches.map((b) => (
          <li key={b.id}>{b.address}</li>
        ))}
      </div>
    </>
  );
};

export default CouponLeftBlock;
