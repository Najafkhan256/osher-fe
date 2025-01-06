import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { getOrders } from '../services/orderService';
import moment from 'moment';
import Loader from './loader';
import auth from '../services/authService';
import OrdersTable from './ordersTable';
import { getMyDetails } from '../services/userService';
import { Calendar } from 'react-date-range';
import Select from './common/select';
import * as userService from '../services/userService';
import Input from './common/input';
import { saveFinancial } from '../services/financialService';

class BrandDetailsPage extends Component {
  state = {
    currentUser: '',
    loading: true,
    orders: [],
    user: '',
    deletePopUp: false,
    expiryDate: new Date(),
    payment: '',
    isProcessing: false,
  };

  async componentDidMount() {
    window.scrollTo(0, 0);
    this.props.updateDashboardMenu('brands');

    await this.populateUserDetails();
  }

  populateUserDetails = async () => {
    try {
      const userId = this.props.match.params.id;

      const currentUser = auth.getCurrentUser();
      this.setState({ currentUser });

      let { data: orders } = await getOrders();
      const { data: user } = await getMyDetails(userId);

      let revOrders = [];
      for (var xy = orders.length - 1; xy >= 0; xy--) {
        revOrders.push(orders[xy]);
      }
      orders = revOrders;

      orders = orders.filter((o) => o.brandId === user._id);

      this.setState({
        orders,
        user: this.mapToViewUser(user),
        expiryDate: new Date(user.paymentExpiry),
        payment: user.payment,
        loading: false,
      });
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        this.props.history.replace('/not-found');
    }
  };

  mapToViewUser(user) {
    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      paymentExpiry: user.paymentExpiry,
      payment: user.payment,
      isActive: user.isActive,
      password: user.password,
      profilePic: user.profilePic || '',
      address: user.address || '',
      city: user.city || '',
      country: user.country || '',
      postalCode: user.postalCode || '',
      // //   theme: user.theme,
    };
  }

  setDate = (date) => {
    console.log(date);
    this.setState({ expiryDate: date });
  };

  handleChange = ({ currentTarget: input }) => {
    const user = { ...this.state.user };
    user[input.name] = input.value === 'Active' ? true : false;
    this.setState({ user });
  };

  handlePaymentInput = ({ currentTarget: input }) => {
    // const user = { ...this.state.user };
    // user[input.name] = input.value === 'Active' ? true : false;
    this.setState({ payment: input.value });
  };

  handleDeletePopUp = () => {
    let { deletePopup } = this.state;
    deletePopup = !deletePopup;
    this.setState({ deletePopup });
  };

  updateBrand = async () => {
    try {
      // this.setState({ isProcessing: true });
      this.setState({ isProcessing: true });
      const { user, expiryDate, payment } = this.state;
      user.paymentExpiry = expiryDate;
      user.payment = payment;

      await userService.updatePayment(user);

      const finance = {
        brandId: user._id,
        brandName: user.name,
        brandPic: user.profilePic,
        payment: payment,
        expiryDate: expiryDate,
        publishDate: new Date(),
      };

      await saveFinancial(finance);

      // auth.logout();
      // auth.loginWithJwt(response.headers['x-auth-token']);

      // this.props.handleNotification({
      //   message: 'Brand updated successfully!',
      //   img: '/img/success.png',
      // });

      this.setState({ isProcessing: false });
      this.props.history.push('/dashboard/brands');
      // window.location = '/';
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        this.setState({ isProcessing: false });
        const errors = { ...this.state.errors };
        errors.email = ex.response.data;
        this.setState({ errors });
      }
    }
  };

  componentWillUnmount() {
    this.setState = (state, callback) => {
      return;
    };
  }

  render() {
    const {
      user,
      loading,
      orders,
      expiryDate,
      deletePopup,
      isProcessing,
      payment,
    } = this.state;

    if (loading) return <Loader />;

    return (
      <div className='order-page'>
        {deletePopup && (
          <React.Fragment>
            <div
              className='delete-popup-background'
              onClick={this.handleDeletePopUp}
            ></div>
            <div className='delete-pop-up'>
              <h5>
                Are you sure to {user.isActive ? 'activate' : 'disable'} this
                brand?
              </h5>
              <div className='inner-pop'>
                <div className='inner-pop-text'>
                  <h2>
                    <span className='gray-span'>Payment Expiry: </span>
                    {moment(expiryDate).format('ll')}
                  </h2>

                  <h2>
                    <span className='gray-span'>Brand Status: </span>
                    {user.isActive ? 'Active' : 'Disabled'}
                  </h2>
                  {/* <h2>Offer: {deleteRequestedOffer.offerDetails}</h2> */}
                </div>
              </div>
              <button disabled={isProcessing} onClick={this.updateBrand}>Yes</button>
              <button onClick={() => this.handleDeletePopUp('')}>No</button>
            </div>
          </React.Fragment>
        )}
        <div className='row'>
          <div className='col-md-12 p-2'>
            <div
              className='profile-right-block'
              style={{ animationDelay: '0.1s' }}
            >
              <br />
              <div className='row ' style={{ width: '100%' }}>
                <div className='col-md-1'>
                  <Link to='/dashboard/brands/'>
                    <button className='back-btn'>
                      <i className='fas fa-angle-double-left'></i> Back
                    </button>
                  </Link>
                </div>

                <div className='col-md-5 p-2'>
                  <div
                    className='profile-right-block dashboard-left-block brand-details-left'
                    style={{ animationDelay: '0.3s', marginBottom: '20px' }}
                  >
                    <br />
                    <div
                      className='brand-pic-circle'
                      style={{
                        backgroundImage: 'url(' + user.profilePic + ')',
                      }}
                    ></div>

                    <div className='profile-left-text'>
                      <h2>
                        <b>{user.name}</b>
                      </h2>

                      <br />
                      <p>
                        Phone: <a href={'tel:' + user.phone}>{user.phone}</a>
                      </p>
                      <p>
                        Email: <a href={'mailto:' + user.email}>{user.email}</a>
                      </p>
                      {/* <p>Address: {user.address}</p>
                      <p>City: {user.city}</p>
                      <p>Country: {user.country}</p> */}
                      <p>Joined: {moment(user.publishDate).format('lll')}</p>
                      <p>
                        Payment Expiry:{' '}
                        {moment(user.paymentExpiry).format('lll')}
                      </p>
                      <p>Payment: ${user.payment}</p>
                      <div>
                        Brand status:{' '}
                        {!loading && (
                          <span
                            className={
                              user.isActive
                                ? 'brand-main-status active-brand'
                                : 'brand-main-status disabled-brand'
                            }
                          >
                            <div>{user.isActive ? 'Active' : 'Disabled'}</div>
                          </span>
                        )}
                      </div>

                      <br />
                    </div>

                    {/* <div className='choose-expiry-date'>
                      <div className='linee'></div>
                      <h3>
                        <span>Expires on: </span>
                        {moment(expiryDate).format('ll')}
                      </h3>
                      <Calendar
                        onChange={(item) => this.setDate(item)}
                        date={expiryDate}
                      />
                    </div> */}
                    {/* <div style={{ width: '100%' }}>
                      <Select
                        options={['Active', 'Disabled']}
                        // options={['Active', 'Used', 'Expired']}
                        name='isActive'
                        value={user.isActive ? 'Active' : 'Disabled'}
                        label='Payment Status'
                        onChange={this.handleChange}
                      />
                      <button
                        className='login-btn'
                        onClick={this.handleDeletePopUp}
                      >
                        Update payment status
                      </button>
                    </div>
                    <br /> */}
                  </div>
                </div>
                <div className='col-md-5 p-2'>
                  <div
                    className='profile-right-block dashboard-left-block'
                    style={{ animationDelay: '0.5s', marginBottom: '20px' }}
                  >
                    <div className='choose-expiry-date'>
                      <h3>
                        <span>Expires on: </span>
                        {moment(expiryDate).format('ll')}
                      </h3>
                      <Calendar
                        onChange={(item) => this.setDate(item)}
                        date={expiryDate}
                      />
                    </div>
                    <div style={{ width: '100%' }}>
                      <Select
                        options={['Active', 'Disabled']}
                        // options={['Active', 'Used', 'Expired']}
                        name='isActive'
                        value={user.isActive ? 'Active' : 'Disabled'}
                        label='Brand Status'
                        onChange={this.handleChange}
                      />

                      <label htmlFor=''>Payment in USD</label>
                      <Input
                        type='text'
                        placeholder='Payment in USD'
                        name='payment'
                        value={payment}
                        onChange={this.handlePaymentInput}
                        // error={errors.name}
                      />

                      <button
                        className='login-btn'
                        onClick={this.handleDeletePopUp}
                      >
                        Update payment status
                      </button>
                    </div>
                    <br />
                  </div>
                </div>
                <div className='col-md-1'></div>
              </div>
              <h5>Recent orders ({orders.length})</h5>
              <br />
              <OrdersTable data={orders} />

              <br />
              <br />
            </div>
          </div>
        </div>
      </div>
    );
  }
  // calculateTotal = (cartItems) => {
  //   let total = 0;

  //   for (const c of cartItems) total = total + c.product.price * c.quantity;

  //   return total;
  // };
}

export default BrandDetailsPage;
