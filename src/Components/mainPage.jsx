import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const MainPage = ({ handleBack }) => {
  const { t } = useTranslation();

  useEffect(() => {
    handleBack(true);
  }, [handleBack]);

  return (
    <div className='main-background'>
      <div className='main-page'>
        <h1 className='main-heading'>{t('PLAY AND WIN')}!</h1>

        <div className='option-blocks'>
          {/* <div className='option'>
            <h2>CHALLENGE</h2>
            <h1 className='quiz-head'>QUIZ</h1>
            <h2>Beat the Brand</h2>

            <div className='discount-badge'>
              <h3>UPTO 70% OFF!</h3>
            </div>
          </div> */}

          <Link to='/whattodo'>
            <div className='option'>
              <h2>{t('WHAT TO DO')}</h2>
              <h2>{t('IN')}</h2>
              <h1 className='montreal-head'>
                {/* M<i className="fas fa-search-location"></i>NTREAL */}
                M<i className='fas fa-search'></i>NTREAL
              </h1>
              <div className='discount-badge'>
                <h3>{t('UPTO')} 35% {t('OFF')}!</h3>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
