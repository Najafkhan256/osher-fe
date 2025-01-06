import React from 'react';
import { useTranslation } from 'react-i18next';


const Nap = ({ handleNap }) => {
  const { t } = useTranslation();


  return (
    <div className='nap'>
      <h2>{t('This screen will disappear after 5 minutes!')}</h2>
      <button onClick={handleNap}>X</button>
    </div>
  );
};

export default Nap;
