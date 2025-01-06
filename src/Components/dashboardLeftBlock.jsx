import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import auth from '../services/authService';

class DashboardLeftBlock extends Component {
  state = {
    user: '',
  };

  async componentDidMount() {
    const user = await auth.getCurrentUser();
    this.setState({ user });
  }

  componentWillUnmount() {
    this.setState = (state, callback) => {
      return;
    };
  }

  render() {
    const { user } = this.state;
    const { currentBlock, t } = this.props;

    return (
      <div className='col-md-2 p-2'>
        <div className='dashboard-left-block'>
          <div
            className='dashboard-pic-circle'
            style={{
              backgroundImage: 'url(' + user.profilePic + ')',
            }}
          ></div>

          <Link to='/update-profile'>
            <div className='dashboard-left-text'>
              <h2>{user.name}</h2>
              {user.isAdmin && <h6>{t('Admin')}</h6>}
              {user.isBrand && (
                <div className='brand-status-bg'>
                  <div
                    className={
                      user.isActive
                        ? 'brand-main-status active-brand'
                        : 'brand-main-status disabled-brand'
                    }
                  >
                    <div className=''>
                      {user.isActive ? 'Active' : 'Disabled'}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Link>

          <br />

          <div className='dashboard-left-menu'>
            <Link to='/dashboard'>
              <div
                className={
                  currentBlock === 'dashboard'
                    ? 'left-menu-link active-link'
                    : 'left-menu-link'
                }
              >
                <h5>{t('Dashboard')}</h5>
                <div></div>
              </div>
            </Link>

            {user.isAdmin && (
              <Link to='/dashboard/brands/'>
                <div
                  className={
                    currentBlock === 'brands'
                      ? 'left-menu-link active-link'
                      : 'left-menu-link'
                  }
                >
                  <h5>{t('Brands')}</h5>
                  <div></div>
                </div>
              </Link>
            )}

            {user.isAdmin && (
              <Link to='/dashboard/videos/'>
                <div
                  className={
                    currentBlock === 'videos'
                      ? 'left-menu-link active-link'
                      : 'left-menu-link'
                  }
                >
                  <h5>{t('Videos')}</h5>
                  <div></div>
                </div>
              </Link>
            )}

            {(user.isAdmin || user.isBrand) && (
              <Link to='/dashboard/locations/'>
                <div
                  className={
                    currentBlock === 'locations'
                      ? 'left-menu-link active-link'
                      : 'left-menu-link'
                  }
                >
                  <h5>{t('Locations')}</h5>
                  <div></div>
                </div>
              </Link>
            )}

            {(user.isAdmin || user.isBrand) && (
              <Link to='/dashboard/customers/'>
                <div
                  className={
                    currentBlock === 'customers'
                      ? 'left-menu-link active-link'
                      : 'left-menu-link'
                  }
                >
                  <h5>{t('Customers')}</h5>
                  <div></div>
                </div>
              </Link>
            )}

            <Link to='/dashboard/orders'>
              <div
                className={
                  currentBlock === 'orders'
                    ? 'left-menu-link active-link'
                    : 'left-menu-link'
                }
              >
                <h5>{t('Orders')}</h5>
                <div></div>
              </div>
            </Link>

            {(user.isAdmin || user.isBrand) && (
              <Link to='/dashboard/products'>
                <div
                  className={
                    currentBlock === 'products'
                      ? 'left-menu-link active-link'
                      : 'left-menu-link'
                  }
                >
                  <h5>{t('Products')}</h5>
                  <div></div>
                </div>
              </Link>
            )}

            <Link to='/dashboard/report'>
              <div
                className={
                  currentBlock === 'report'
                    ? 'left-menu-link active-link'
                    : 'left-menu-link'
                }
              >
                <h5>{t('Report')}</h5>
                <div></div>
              </div>
            </Link>

            {(user.isAdmin || user.isBrand) && (
              <Link to='/dashboard/financials'>
                <div
                  className={
                    currentBlock === 'financials'
                      ? 'left-menu-link active-link'
                      : 'left-menu-link'
                  }
                >
                  <h5>{t('Financials')}</h5>
                  <div></div>
                </div>
              </Link>
            )}

            <Link to='/logout/'>
              <div className='left-menu-link'>
                <h5>{t('Logout')}</h5>
                <div></div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

export default DashboardLeftBlock;
