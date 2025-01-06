import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { getOrders } from '../services/orderService';
import moment from 'moment';
import Loader from './loader';
import { getCustomer } from '../services/customerService';
import auth from '../services/authService';
import OrdersTable from './ordersTable';

class CustomerPage extends Component {
  state = {
    currentUser: '',
    loading: true,
    orders: [],
    user: '',
  };

  async componentDidMount() {
    window.scrollTo(0, 0);
    this.props.updateDashboardMenu('customers');

    await this.populateUserDetails();
  }

  populateUserDetails = async () => {
    try {
      const userId = this.props.match.params.id;

      const currentUser = auth.getCurrentUser();
      this.setState({ currentUser });

      let { data: orders } = await getOrders();
      const { data: user } = await getCustomer(userId);

      let revOrders = [];
      for (var xy = orders.length - 1; xy >= 0; xy--) {
        revOrders.push(orders[xy]);
      }
      orders = revOrders;

      orders = orders.filter((o) => o.userId === user._id);
      if (!currentUser.isAdmin) {
        orders = orders.filter((o) => o.brandId === currentUser._id);
      }

      this.setState({
        orders,
        user: this.mapToViewUser(user),
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
      // password: user.password,
      // profilePic: user.profilePic || '',
      // address: user.address || '',
      // city: user.city || '',
      // country: user.country || '',
      // postalCode: user.postalCode || '',
      // //   theme: user.theme,
    };
  }

  componentWillUnmount() {
    this.setState = (state, callback) => {
      return;
    };
  }

  render() {
    const { user, loading, orders } = this.state;

    if (loading) return <Loader />;

    return (
      <div className='order-page'>
        <div className='row'>
          <div className='col-md-12 p-2'>
            <div
              className='profile-right-block'
              style={{ animationDelay: '0.1s' }}
            >
              <br />
              <div className='row ' style={{ width: '100%' }}>
                <div className='col-md-3'>
                  <Link to='/dashboard/customers/'>
                    <button className='back-btn'>
                      <i className='fas fa-angle-double-left'></i> Back
                    </button>
                  </Link>
                </div>

                <div className='col-md-6 p-2'>
                  <div
                    className='profile-right-block dashboard-left-block'
                    style={{ animationDelay: '0.3s', marginBottom: '20px' }}
                  >
                    <br />
                    <div className='customer-pic-circle'>
                      <h4>{user.name.charAt(0)}</h4>
                    </div>

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
                      <p>Joined: {moment(user.publishDate).format('lll')}</p>
                      {/* <p>Address: {user.address}</p>
                      <p>City: {user.city}</p>
                      <p>Country: {user.country}</p> */}
                      <br />
                    </div>
                  </div>
                </div>
                <div className='col-md-3'></div>
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

export default CustomerPage;
