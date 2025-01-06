import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { getOrder, saveOrder } from '../services/orderService';
import { getMyDetails } from '../services/userService';
import moment from 'moment';
import Select from './common/select';
import auth from '../services/authService';
import Loader from './loader';
import { getCustomer } from '../services/customerService';

class OrderPage extends Component {
  state = {
    currentUser: '',
    loading: true,
    order: [],
    user: '',
    cancelPopup: false,
    deletePopup: false,
  };

  async componentDidMount() {
    window.scrollTo(0, 0);
    this.props.updateDashboardMenu('orders');

    await this.populateOrderDetails();

    const currentUser = auth.getCurrentUser();
    this.setState({ currentUser, loading: false });
  }

  populateOrderDetails = async () => {
    try {
      const orderId = this.props.match.params.id;

      const { data: order } = await getOrder(orderId);
      this.setState({ order: this.mapToViewOrder(order) });

      const { data: brand } = await getMyDetails(order.brandId);
      this.setState({
        brand: this.mapToViewBrand(brand),
      });

      const { data: customer } = await getCustomer(order.userId);
      this.setState({
        user: this.mapToViewCustomer(customer),
      });
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        this.props.history.replace('/not-found');
    }
  };

  mapToViewOrder(order) {
    return {
      _id: order._id,
      userId: order.userId,
      name: order.name,
      email: order.email,
      phone: order.phone,
      brandId: order.brandId,
      bundleId: order.bundleId,
      bundleName: order.bundleName,
      offerPrice: order.offerPrice,
      offerDetail: order.offerDetail,
      brandCategory: order.brandCategory,
      coupon: order.coupon,
      orderStatus: order.orderStatus,
      publishDate: order.publishDate,
      expiryDate: order.expiryDate,
      branches: order.branches,
    };
  }

  mapToViewCustomer(user) {
    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      // password: user.password,
      // profilePic: user.profilePic || '',
      // address: user.address || '',
      // city: user.city || '',
      // country: user.country || '',
      // postalCode: user.postalCode || '',
      //   theme: user.theme,
    };
  }
  mapToViewBrand(user) {
    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      password: user.password,
      profilePic: user.profilePic || '',
      address: user.address || '',
      city: user.city || '',
      country: user.country || '',
      postalCode: user.postalCode || '',

      // theme: user.theme,
    };
  }

  handleChange = ({ currentTarget: input }) => {
    const order = { ...this.state.order };
    order[input.name] = input.value;

    this.setState({ order });
  };

  handleCancelPopUp = () => {
    let { cancelPopup } = this.state;
    cancelPopup = !cancelPopup;
    this.setState({ cancelPopup });
  };

  handleDeletePopUp = (offer) => {
    this.setState({ deleteRequestedOffer: offer });

    let { deletePopup } = this.state;
    deletePopup = !deletePopup;
    this.setState({ deletePopup });
  };

  updateOrder = async (status) => {
    const { order } = this.state;

    if (status) {
      order['orderStatus'] = status;
    }

    try {
      await saveOrder(order);

      //   this.props.handleNotification({
      //     message: 'Order placed successfully!',
      //     img: '/img/success.png',
      //   });

      this.props.history.push('/dashboard/orders/');
    } catch (err) {
      console.log(err);
    }
  };

  componentWillUnmount() {
    this.setState = (state, callback) => {
      return;
    };
  }

  render() {
    const {
      order,
      loading,
      currentUser,
      cancelPopup,
      brand,
      deletePopup,
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
              <h5>Are you sure to update order status?</h5>
              <div className='inner-pop'>
                <div className='inner-pop-text'>
                  <h2><span className='gray-span'>New Status: </span>{order.orderStatus}</h2>
                  {/* <h2>Offer: {deleteRequestedOffer.offerDetails}</h2> */}
                </div>
              </div>
              <button onClick={() => this.updateOrder('')}>Yes</button>
              <button onClick={() => this.handleDeletePopUp('')}>No</button>
            </div>
          </React.Fragment>
        )}

        <div className='row'>
          {cancelPopup && (
            <React.Fragment>
              <div
                className='delete-popup-background'
                onClick={this.handleCancelPopUp}
              ></div>
              <div className='delete-pop-up'>
                <h5>Are you sure to cancel this order?</h5>
                <div className='inner-pop'>
                  {/* <img src={deleteRequestedProduct.imageUrl} alt='pop' /> */}
                  <div className='inner-pop-text'>
                    {/* <h2>Order:id {order._id}</h2>
                    <h2>Total amount: {this.calculateTotal(cartItems)}</h2> */}
                  </div>
                </div>
                <button onClick={() => this.updateOrder('Cancelled')}>
                  Yes
                </button>
                <button onClick={this.handleCancelPopUp}>No</button>
              </div>
            </React.Fragment>
          )}

          <div className='col-md-12 p-2'>
            <div
              className='profile-right-block'
              style={{ animationDelay: '0.1s' }}
            >
              <br />

              <Link to='/dashboard/orders/'>
                <button className='back-btn'>
                  <i className='fas fa-angle-double-left'></i> Back
                </button>
              </Link>

              <div className='row ' style={{ width: '100%' }}>
                <div className='col-md-8 p-4 order-page-details'>
                  <p>
                    <b>Order id:</b> {order._id}
                  </p>
                  <p>
                    <b>Order placed:</b>{' '}
                    {moment(order.publishDate).format('lll')}
                  </p>
                  <p>
                    <b>Expired on:</b> {moment(order.expiryDate).format('lll')}
                    {console.log(order.expiryDate)}
                  </p>
                  <p>
                    <b>Buyer name:</b> {order.name}
                  </p>
                  <p>
                    <b>Buyer email:</b> {order.email}
                  </p>
                  <p>
                    <b>Buyer phone:</b> {order.phone}
                  </p>

                  <div>
                    <b>Coupon status: </b>
                    {!loading && (
                      <span
                        className={
                          'order-status ' + order.orderStatus.toLowerCase()
                        }
                      >
                        <div>{order.orderStatus}</div>
                      </span>
                    )}
                  </div>
                  {/* <br /> */}

                  <div className='linee'></div>

                  <div className='brand-category'>
                    <div>{order.brandCategory}</div>
                  </div>
                  <h3>{order.bundleName}</h3>
                  <h6>{order.offerDetail}</h6>
                  <h5>
                    $<b>{order.offerPrice}</b>
                  </h5>
                  <br />

                  <h4 className='orderpage-coupon'>{order.coupon}</h4>

                  {(currentUser.isAdmin || currentUser.isBrand) &&
                    (order.orderStatus === 'Active' ||
                      order.orderStatus === 'Used') && (
                      <>
                        <div className='linee'></div>
                        <br />
                        <Select
                          options={['Active', 'Used']}
                          // options={['Active', 'Used', 'Expired']}
                          name='orderStatus'
                          value={order.orderStatus}
                          label='Update coupon Status'
                          onChange={this.handleChange}
                        />
                        <button
                          className='continue-to-shipping'
                          onClick={() => this.handleDeletePopUp('')}
                          // onClick={() => this.updateOrder('')}
                        >
                          Update order status
                        </button>
                      </>
                    )}

                  {order.orderStatus === 'Placed' && !currentUser.isAdmin && (
                    <>
                      <button
                        className='continue-to-shipping'
                        onClick={this.handleCancelPopUp}
                      >
                        Cancel order
                      </button>
                    </>
                  )}
                </div>

                <div className='col-md-4 p-2 '>
                  <div
                    className='profile-right-block dashboard-left-block'
                    style={{ animationDelay: '0.3s' }}
                  >
                    <br />
                    <div
                      className='dashboard-pic-circle'
                      style={{
                        backgroundImage: 'url(' + brand.profilePic + ')',
                      }}
                    ></div>

                    <div className='profile-left-text'>
                      <h2 className='brand-name'>{brand.name}</h2>
                      <br />
                    </div>
                  </div>
                </div>
              </div>
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

  // cardInfo = (payMethod) => {
  //   const fields = payMethod.split(' + ');

  //   const type = this.capitalizeFirstLetter(fields[0]);
  //   const last4 = fields[3];

  //   let img = '/img/visa.png';
  //   if (fields[2] === 'mastercard') img = '/img/master.png';

  //   return { type, img, last4 };
  // };

  // capitalizeFirstLetter = (string) => {
  //   return string.charAt(0).toUpperCase() + string.slice(1);
  // };
}

export default OrderPage;
