import React from 'react';
import { Link } from 'react-router-dom';
// import { Lazy } from 'rrr-lazy';
import Slider from 'react-slick';

const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
};

const BrandCard = ({ delay, brand, mainBrand }) => {
  return (
    <div
      style={{ animationDelay: `${(delay += 0.1)}s` }}
      className='brandcard col-sm-4'
    >
      <Link to={`/whattodo/brand/${brand._id}`}>
        <Slider {...settings}>
          {brand.img.map((b) => (
            <div className='brand-carousel' key={b}>
              <div className='brand-carousel-2'>
                <img width='100%' src={b} alt='Brand' />
              </div>
            </div>
          ))}
        </Slider>

        <h2 className='brand-title'>{brand.name}</h2>
        {/* <h3 className='brand-price'>${brand.offers[0].price}</h3> */}
        <div className='brand-category'>
          <div>{brand.category}</div>
        </div>
      </Link>

      {mainBrand && (
        <div className='brandcard-brand-identity'>
          <div
            className='profile-pic-circle'
            style={{
              backgroundImage: 'url(' + mainBrand.profilePic + ')',
            }}
          ></div>
          <p>{mainBrand.name}</p>
        </div>
      )}
    </div>
  );
};

export default BrandCard;
