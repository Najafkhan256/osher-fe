import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Clock from 'react-live-clock';

const Footer = (props) => {
  const {
    handleNap,
    backAddress,
    mutePage,
    handleVolumeUp,
    handleVolumeDown,
    visibleBack,
    user,
  } = props;

  const { i18n, t } = useTranslation();

  const changeLanguage = (event) => {
    i18n.language === 'en'
      ? i18n.changeLanguage('fr')
      : i18n.changeLanguage('en');
    // i18n.changeLanguage(event.target.value)
  };

  return (
    <div className='footer'>
      <Link to='/'>
        <img className='pc-only logo' src='/img/logo2.png' alt='OSHER' />
      </Link>

      {/* <div onChange={changeLanguage}>
        <input type='radio' value='en' name='language' defaultChecked /> English
        <input type='radio' value='fr' name='language' /> French
      </div> */}

      <div className='pc-only'>
        <div className='clock-date-block'>
          <div className='clock-block'>
            <Clock
              format={'h:mm'}
              ticking={true}
              timezone={'America/Toronto'}
            />
          </div>
          <div className='date-block'>
            <Clock format={'ddd'} timezone={'America/Toronto'} />
            <Clock format={'DD MMM'} timezone={'America/Toronto'} />
          </div>
        </div>
      </div>

      <audio className='audio-element'>
        <source src='/img/audio.mp3'></source>
      </audio>

      <div className='footer-icons'>
        {visibleBack && (
          <div className='icon-block' onClick={() => backAddress()}>
            <i className='fas fa-angle-double-left'></i>
            <p>{t('Back')}</p>
          </div>
        )}

        <div className='icon-block' onClick={changeLanguage}>
          <i className='fas fa-language'></i>
          <p>{t('Language')}</p>
        </div>

        <div className='icon-block' onClick={mutePage}>
          <i className='fas fa-volume-mute'></i>
          <p>{t('Mute')}</p>
        </div>

        <div className='icon-block' onClick={handleVolumeDown}>
          <i className='fas fa-volume-down'></i>
          <p>{t('Down')}</p>
        </div>

        <div className='icon-block' onClick={handleVolumeUp}>
          <i className='fas fa-volume-up'></i>
          <p>{t('Up')}</p>
        </div>

        {/* <div className='icon-block'>
          <i className='fas fa-sun'></i>
          <p>Brightness</p>
        </div> */}

        <div className='icon-block' onClick={handleNap}>
          <i className='far fa-moon'></i>
          <p>{t('Nap')}</p>
        </div>

        <Link to='/weather'>
          <div className='icon-block'>
            <i className='fas fa-cloud-sun'></i>
            <p>{t('Weather')}</p>
          </div>
        </Link>

        {user && !user.isAdmin && user && !user.isBrand && (
          <Link to='/profile'>
            <div className='icon-block'>
              <i className='fas fa-user-tie'></i>
              <p>{t('Driver')}</p>
            </div>
          </Link>
        )}

        {((user && user.isAdmin) || (user && user.isBrand)) && (
          <Link to='/dashboard'>
            <div className='icon-block dashboard-icon-block'>
              <i className='fas fa-th'></i>
              <p>{t('Dashboard')}</p>
            </div>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Footer;
