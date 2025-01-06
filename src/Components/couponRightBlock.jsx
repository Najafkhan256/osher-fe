import React, { useState, useEffect } from 'react';
import RadioInput from './common/radioInput';
import moment from 'moment';

const CouponRightBlock = ({
  data,
  currentOffer,
  radioFunction,
  handleCoupon,
  expiry,
  t,
}) => {
  const [days, setDays] = useState('');
  const [hours, setHours] = useState('');
  const [minutes, setMinutes] = useState('');
  const [seconds, setSeconds] = useState('');
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    var countDownDate = new Date(expiry).getTime();

    setInterval(() => {
      var now = new Date().getTime();
      var timeleft = countDownDate - now;

      if (timeleft < 0) {
        setExpired(true);
      }

      setDays(Math.floor(timeleft / (1000 * 60 * 60 * 24)));
      setHours(
        Math.floor((timeleft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      );
      setMinutes(Math.floor((timeleft % (1000 * 60 * 60)) / (1000 * 60)));
      setSeconds(Math.floor((timeleft % (1000 * 60)) / 1000));
    }, 1000);
    calcTime('-5');
  }, [expiry]);

  const calcTime = (offset) => {
    // create Date object for current location
    var d = new Date();

    // convert to msec
    // add local time zone offset
    // get UTC time in msec
    var utc = d.getTime() + d.getTimezoneOffset() * 60000;

    // create new Date object for different city
    // using supplied offset
    new Date(utc + 3600000 * offset);

    // return time as a string
  };

  return (
    <div className='coupon-right-block'>
      {data.map((o) => (
        <RadioInput
          key={o.price}
          order={o}
          currentOffer={currentOffer}
          handleChange={radioFunction}
        />
      ))}

      <button
        disabled={new Date() - new Date(expiry) > 0}
        className='get-coupon orange-btn'
        onClick={handleCoupon}
      >
        {t('Get this coupon')}
      </button>

      <div className='choose-expiry-date'>
        <div className='linee'></div>
        <h3>
          <span>{t('Expiry')}: </span>
          {moment(expiry).format('ll')}
        </h3>
        <div className='expiry-countdown'>
          <span>{t('Expire in')}: </span>
          {expired ? (
            <p>{t('EXPIRED')}!!</p>
          ) : (
            <>
              <p>{days}d </p>
              <p>{hours}h </p>
              <p>{minutes}m </p>
              <p>{seconds}s </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CouponRightBlock;
