import React, { Component } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import DashboardOverview from './dashboardOverview';
import DashboardLeftBlock from './dashboardLeftBlock';
import Customers from './customers';
import Orders from './orders';
import OrderPage from './orderPage';
import CustomerPage from './customerPage';
import ProductsDashboard from './productsDashboard';
import Report from './report';
import auth from '../services/authService';
import Locations from './locations';
import Brands from './brands';
import BrandDetailsPage from './brandDetailsPage';
import { getMyDetails } from '../services/userService';
import moment from 'moment';
import Financials from './financials';
import VideosPage from './videosPage';

class Dashboard extends Component {
  state = {
    currentBlock: 'dashboard',
    user: '',
    myInfo: {},
    warningAlert: false,
    alertBox: false,
  };

  async componentDidMount() {
    window.scrollTo(0, 0);
    const user = auth.getCurrentUser();
    this.setState({ user });
    if (user.isBrand) {
      const { data: myInfo } = await getMyDetails(user._id);
      this.setState({ myInfo });

      if (new Date() - new Date(myInfo.paymentExpiry) > -432000000) {
        this.setState({ warningAlert: true, alertBox: true });

        if (new Date() - new Date(myInfo.paymentExpiry) > 0) {
          this.setState({ alreadyExpired: true });
        }
      }
    }

    this.props.handleBack(true);
  }

  hideModal = () => {
    this.setState({
      alertBox: false,
    });
    setTimeout(() => {
      this.setState({ warningAlert: false });
    }, 600);
  };

  handleCoupon = () => {
    this.setState({ alertBox: true, displayModal: true });
  };

  componentWillUnmount() {
    this.setState = (state, callback) => {
      return;
    };
  }

  updateDashboardMenu = (block) => {
    this.setState({ currentBlock: block });
  };

  render() {
    const {
      currentBlock,
      user,
      warningAlert,
      myInfo,
      alertBox,
      alreadyExpired,
    } = this.state;
    const { t } = this.props;

    if (!auth.getCurrentUser().isAdmin && !auth.getCurrentUser().isBrand) return <Redirect to='/profile' />;

    return (
        <div className='dashboard'>
          {warningAlert && (
            <div
              className={
                alertBox
                  ? 'warning-alert-background'
                  : 'warning-alert-background hide-warning-alert-bg'
              }
            >
              <div
                className={
                  alertBox
                    ? 'warning-alert'
                    : 'warning-alert hide-warning-alert'
                }
              >
                <div
                  className='notification-pic'
                  style={{ backgroundImage: 'url(/img/alert.png)' }}
                ></div>

                <div className='alert-text-block'>
                  <h6>
                    {alreadyExpired
                      ? 'Your payment have expired '
                      : 'Your payment will expire '}
                    {moment(myInfo.paymentExpiry).fromNow()}
                  </h6>

                  <div>
                    <button>Contact Admin</button>
                    <button onClick={this.hideModal}>Dismiss</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* {warningAlert && (
        
          <div className='warning-alert-background'>
            <div className='warning-alert'>
              <div
                className='notification-pic'
                style={{ backgroundImage: 'url(/img/alert.png)' }}
              ></div>

              <div className='alert-text-block'>
                <h6>
                  Your payment will expire{' '}
                  {moment(myInfo.paymentExpiry).fromNow()}
                </h6>

                <div>
                  <button>Contact Admin</button>
                  <button onClick={()=> this.setState({warningAlert: false})}>Dismiss</button>
                </div>
              </div>
            </div>
          </div>
        )} */}

          <div className='row'>
            <DashboardLeftBlock t={t} currentBlock={currentBlock} />

            <div className='col-md-10 dashboard-right-block'>
              <Switch>
                {(user.isAdmin || user.isBrand) && (
                  <Route
                    path='/dashboard/customers/customer/:id'
                    render={(props) => (
                      <CustomerPage
                        {...props}
                        updateDashboardMenu={this.updateDashboardMenu}
                      />
                    )}
                  />
                )}

                {(user.isAdmin || user.isBrand) && (
                  <Route
                    path='/dashboard/locations'
                    render={(props) => (
                      <Locations
                        {...props}
                        t={t}
                        updateDashboardMenu={this.updateDashboardMenu}
                      />
                    )}
                  />
                )}

                {(user.isAdmin || user.isBrand) && (
                  <Route
                    path='/dashboard/financials'
                    render={(props) => (
                      <Financials
                        {...props}
                        updateDashboardMenu={this.updateDashboardMenu}
                      />
                    )}
                  />
                )}

                {user.isAdmin && (
                  <Route
                    path='/dashboard/brands/brand/:id'
                    render={(props) => (
                      <BrandDetailsPage
                        {...props}
                        updateDashboardMenu={this.updateDashboardMenu}
                      />
                    )}
                  />
                )}

                {user.isAdmin && (
                  <Route
                    path='/dashboard/videos'
                    render={(props) => (
                      <VideosPage
                        {...props}
                        t={t}
                        updateDashboardMenu={this.updateDashboardMenu}
                      />
                    )}
                  />
              )}
              
                {user.isAdmin && (
                  <Route
                    path='/dashboard/brands'
                    render={(props) => (
                      <Brands
                        {...props}
                        t={t}
                        updateDashboardMenu={this.updateDashboardMenu}
                      />
                    )}
                  />
                )}

                {(user.isAdmin || user.isBrand) && (
                  <Route
                    path='/dashboard/customers'
                    render={(props) => (
                      <Customers
                        {...props}
                        t={t}
                        updateDashboardMenu={this.updateDashboardMenu}
                      />
                    )}
                  />
                )}

                {(user.isAdmin || user.isBrand) && (
                  <Route
                    path='/dashboard/products'
                    render={(props) => (
                      <ProductsDashboard
                        {...props}
                        updateDashboardMenu={this.updateDashboardMenu}
                      />
                    )}
                  />
                )}

                <Route
                  path='/dashboard/orders/order/:id'
                  render={(props) => (
                    <OrderPage
                      {...props}
                      updateDashboardMenu={this.updateDashboardMenu}
                    />
                  )}
                />

                <Route
                  path='/dashboard/orders'
                  render={(props) => (
                    <Orders
                      {...props}
                      updateDashboardMenu={this.updateDashboardMenu}
                    />
                  )}
                />

                <Route
                  path='/dashboard/report'
                  render={(props) => (
                    <Report
                      {...props}
                      updateDashboardMenu={this.updateDashboardMenu}
                    />
                  )}
                />

                <Route
                  exact
                  path='/dashboard/'
                  render={(props) => (
                    <DashboardOverview
                      {...props}
                      t={t}
                      updateDashboardMenu={this.updateDashboardMenu}
                    />
                  )}
                />
              </Switch>
            </div>
          </div>
        </div>
      );

  }
}

export default withTranslation()(Dashboard);
