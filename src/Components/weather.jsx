import React, { useEffect } from 'react';
import ReactWeather, { useOpenWeather } from 'react-open-weather';
import { useTranslation } from 'react-i18next';



const Weather = ({ handleBack }) => {
  const { t } = useTranslation();
  const { data, isLoading, errorMessage } = useOpenWeather({
    key: '308171c3470184fed25eb613f7ecf8a0',
    lat: '45.5017',
    lon: '73.5673',
    lang: 'en',
    unit: 'metric', // values are (metric, standard, imperial)
  });

  useEffect(() => {
    handleBack(true);
  }, [handleBack]);

  return (
    <div className='main-background'>
      <div className='weather-page'>
        <h1>{t('Weather')}</h1>
        <ReactWeather
          isLoading={isLoading}
          errorMessage={errorMessage}
          data={data}
          lang='en'
          locationLabel='Montreal, Canada'
          unitsLabels={{ temperature: 'C', windSpeed: 'Km/h' }}
          showForecast
        />
      </div>
    </div>
  );
};

export default Weather;
