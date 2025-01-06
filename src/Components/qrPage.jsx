import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const QrPage = ({ handleBack }) => {
  const { t } = useTranslation();

  useEffect(() => {
    handleBack(false);
  }, [handleBack]);

  return (
    <div className='main-background'>
      <div className='qr-page'>
        <img src='/img/main-pic2.png' alt='QR' className='qr-code' />
        <Link to='/main'>
          <button className='orange-btn'>{t('Continue')}</button>
        </Link>
        {/* <audio src='/img/audio.mp3' controls autoPlay /> */}
      </div>
    </div>
  );
};

export default QrPage;
