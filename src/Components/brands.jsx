import React, { Component } from 'react';
import { getOrders } from '../services/orderService';
import Loader from './loader';
import { getCustomers } from '../services/customerService';
import auth from '../services/authService';
import { getUsers, updatePayment } from '../services/userService';
import BrandsTable from './brandsTable';

class Brands extends Component {
  state = {
    orders: [],
    users: [],
    loading: true,
  };

  async componentDidMount() {
    window.scrollTo(0, 0);
    this.props.updateDashboardMenu('brands');

    const user = await auth.getCurrentUser();
    this.setState({ user });

    let { data: customers } = await getCustomers();
    let { data: orders } = await getOrders();
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

    this.setState({ users, customers, orders, loading: false });
  }

  componentWillUnmount() {
    this.setState = (state, callback) => {
      return;
    };
  }

  render() {
    const { users, loading, customers, orders } = this.state;
    const { t } = this.props;

    if (loading) return <Loader />;

    return (
      <div className='customers-page'>
        <div className='row'>
          <div className='col-md-12 p-2'>
            <div
              className='profile-right-block'
              style={{ animationDelay: '0.1s' }}
            >
              <h1>{t('Brands')}</h1>
              <br />
              <BrandsTable
                data={users}
                orders={orders}
                customers={customers}
                // length={4}
                // dateFromNow={true}
              />
              <br />
            </div>
          </div>
        </div>
      </div>
    );
  }

  totalOrders = (id) => {
    const { orders } = this.state;
    const order = orders.filter((u) => u.userId === id);

    return order.length;
  };
}

export default Brands;
