import React, { Component, Suspense } from 'react';
import { Route, Switch } from 'react-router-dom';
import { Redirect } from 'react-router-dom';
import MainPage from './mainPage';
import QrPage from './qrPage';
import Footer from './footer';
import NotFound from './notFound';
import Nap from './nap';
import VolumeScreen from './common/volumeScreen';
import DriverProfile from './driverProfile';
import LoginPage from './loginPage';
import auth from '../services/authService';
import ProtectedRoute from './common/protectedRoute';
import Logout from './logout';
import WhatToDo from './whatToDo';
import CouponPage from './couponPage';
import history from '../services/history';
import NotificationBar from './common/notificationBar';
import Dashboard from './dashboard';
import SignupPage from './signupPage';
import UpdateProfile from './updateProfile';
import UpdatePassword from './updatePassword';
import AddNewProduct from './addNewProduct';
import BrandSignup from './brandSignup';
import LogoutDriver from './logoutDriver';
import { getUsers, updatePayment } from '../services/userService';
import { getOrders, saveOrder } from '../services/orderService';
import AdminLoginPage from './adminLoginPage';
import UpdateDriverProfile from './updateDriverProfile';
import Weather from './weather';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import './stylesheet.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '../i18n';
import ForgotPasswordPage from './forgotPasswordPage';

class Application extends Component {
  state = {
    nap: false,
    mute: false,
    volumePop: false,
    volume: 1,
    backAddress: '',
    visibleBack: false,
    notify: '',
  };

  componentWillMount() {
    this.setState({
      visibleBack: true,
    });
  }

  async componentDidMount() {
    const user = auth.getCurrentUser();

    await this.refreshAllData();

    this.setState({
      user,
      backAddress: history.goBack,
      // visibleBack: true,
    });
  }

  refreshAllData = async () => {
    const { data: users } = await getUsers();

    for (let v = 0; v < users.length; v++) {
      if (
        new Date() - new Date(users[v].paymentExpiry) > 0 &&
        users[v].isActive !== false
      ) {
        users[v].isActive = false;
        await updatePayment(users[v]);
      }
    }

    let { data: orders } = await getOrders();

    for (var v = 0; v < orders.length; v++) {
      if (
        new Date() - new Date(orders[v].expiryDate) > 0 &&
        orders[v].orderStatus !== 'Used'
      ) {
        orders[v].orderStatus = 'Expired';
        await saveOrder(orders[v]);
      }
    }
  };

  handleNotification = (notify) => {
    this.setState({ notify });
    setTimeout(() => this.setState({ notify: '' }), 4000);
  };

  updateUser = () => {
    const user = auth.getCurrentUser();
    this.setState({ user });
  };

  handleNap = () => {
    const { nap } = this.state;
    this.setState({ nap: !nap });

    if (!nap) {
      setTimeout(() => {
        this.setState({ nap: false });
      }, 300000);
    }
  };

  muteMe = (element) => {
    if (element.muted) element.muted = false;
    else element.muted = true;
    // element.pause();
  };

  mutePage = () => {
    this.setState({ mute: true });

    setTimeout(() => {
      this.setState({ mute: false });
    }, 1500);
    document
      .querySelectorAll('video, audio')
      .forEach((element) => this.muteMe(element));
  };

  volChange = (element, role) => {
    if (element.muted) element.muted = false;

    if (role === 'up' && element.volume < 1)
      element.volume = parseFloat(element.volume + 0.1);
    else if (role === 'down' && element.volume > 0.2)
      element.volume = parseFloat(element.volume - 0.1);

    this.setState({ volume: element.volume });
  };

  handleVolumeUp = () => {
    this.setState({ volumePop: true });

    setTimeout(() => {
      this.setState({ volumePop: false });
    }, 2000);

    document
      .querySelectorAll('video, audio')
      .forEach((element) => this.volChange(element, 'up'));
  };

  handleVolumeDown = () => {
    this.setState({ volumePop: true });

    setTimeout(() => {
      this.setState({ volumePop: false });
    }, 2000);

    document
      .querySelectorAll('video, audio')
      .forEach((element) => this.volChange(element, 'down'));
  };

  handleBack = (value) => {
    this.setState({ visibleBack: value });
  };

  render() {
    const {
      nap,
      mute,
      volumePop,
      volume,
      backAddress,
      user,
      visibleBack,
      notify,
    } = this.state;

    return (
      <div>
        <Suspense fallback={null}>
          <Footer
            handleNap={this.handleNap}
            backAddress={backAddress}
            mutePage={this.mutePage}
            handleVolumeUp={this.handleVolumeUp}
            handleVolumeDown={this.handleVolumeDown}
            visibleBack={visibleBack}
            user={user}
          />

          {notify && (
            <NotificationBar message={notify.message} img={notify.img} />
          )}

          {nap && <Nap handleNap={this.handleNap} />}
          {mute && <VolumeScreen role='mute' />}
          {volumePop && <VolumeScreen role='volume' value={volume} />}

          <Switch>
            <ProtectedRoute
              path='/profile'
              render={(props) => (
                <DriverProfile {...props} handleBack={this.handleBack} />
              )}
            />

            <Route
              path='/whattodo/brand/:id'
              render={(props) => (
                <CouponPage
                  {...props}
                  handleBack={this.handleBack}
                  handleNotification={this.handleNotification}
                />
              )}
            ></Route>
 
            <Route
              path='/whattodo'
              render={(props) => <WhatToDo {...props} />}
            />

            <Route
              path='/main'
              render={(props) => (
                <MainPage {...props} handleBack={this.handleBack} />
              )}
            />

            <Route
              path='/weather'
              render={(props) => (
                <Weather {...props} handleBack={this.handleBack} />
              )}
            />

            <Route
              path='/signup/'
              render={(props) => {
                if (auth.getCurrentUser()) {
                  return <Redirect to='/dashboard' />;
                }
                return (
                  <SignupPage
                    {...props}
                    updateUser={this.updateUser}
                    handleNotification={this.handleNotification}
                  />
                );
              }}
            />

            <Route
              path='/forgot-password/'
              render={(props) => (
                <ForgotPasswordPage
                  {...props}
                  handleNotification={this.handleNotification}
                />
              )}
            />

            <Route
              path='/logout'
              render={(props) => (
                <Logout
                  {...props}
                  updateUser={this.updateUser}
                  handleBack={this.handleBack}
                />
              )}
            />
            <Route path='/logout-driver' component={LogoutDriver} />

            <Route
              path='/brand-signup/'
              render={(props) => {
                if (auth.getCurrentUser()) {
                  return <Redirect to='/dashboard' />;
                }
                return (
                  <BrandSignup
                    {...props}
                    updateUser={this.updateUser}
                    handleNotification={this.handleNotification}
                  />
                );
              }}
            />

            <Route
              path='/login/'
              render={(props) => {
                if (auth.getCurrentUser()) {
                  return <Redirect to='/profile' />;
                }
                return (
                  <LoginPage
                    {...props}
                    handleBack={this.handleBack}
                    updateUser={this.updateUser}
                    handleNotification={this.handleNotification}
                  />
                );
              }}
            />

            <Route
              path='/admin-login/'
              render={(props) => {
                if (auth.getCurrentUser()) {
                  return <Redirect to='/dashboard' />;
                }
                return (
                  <AdminLoginPage
                    {...props}
                    handleBack={this.handleBack}
                    updateUser={this.updateUser}
                    handleNotification={this.handleNotification}
                  />
                );
              }}
            />

            <ProtectedRoute
              path='/update-password/'
              render={(props) => (
                <UpdatePassword
                  {...props}
                  handleNotification={this.handleNotification}
                />
              )}
            />

            {((user && user.isAdmin) || (user && user.isBrand)) && (
              <Route
                path='/add-new-product/:id?'
                render={(props) => (
                  <AddNewProduct
                    {...props}
                    handleNotification={this.handleNotification}
                  />
                )}
              />
            )}

            <ProtectedRoute
              path='/update-profile'
              render={(props) => (
                <UpdateProfile
                  {...props}
                  updateUser={this.updateUser}
                  handleNotification={this.handleNotification}
                />
              )}
            />

            <ProtectedRoute
              path='/update-driver'
              render={(props) => (
                <UpdateDriverProfile
                  {...props}
                  updateUser={this.updateUser}
                  handleNotification={this.handleNotification}
                />
              )}
            />

            <ProtectedRoute
              path='/dashboard'
              render={(props) => (
                <Dashboard {...props} handleBack={this.handleBack} />
              )}
            />

            <Route
              path='/not-found'
              render={(props) => (
                <NotFound {...props} handleBack={this.handleBack} />
              )}
            />

            <Route
              exact
              path='/'
              render={(props) => (
                <QrPage {...props} handleBack={this.handleBack} />
              )}
            />
            <Redirect to='/not-found' />
          </Switch>
        </Suspense>
      </div>
    );
  }
}

export default Application;
