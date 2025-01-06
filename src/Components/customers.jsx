import React, { Component } from 'react';
import { getOrders } from '../services/orderService';
import { Link } from 'react-router-dom';

import moment from 'moment';
import Loader from './loader';
import { getCustomers } from '../services/customerService';
import auth from '../services/authService';
//import ChooseBrand from './common/chooseBrand';
import { getUsers } from '../services/userService';

class Customers extends Component {
  state = {
    orders: [],
    users: [],
    user: {},
    loading: true,
    currentBrand: '',
  };

  async componentDidMount() {
    window.scrollTo(0, 0);
    this.props.updateDashboardMenu('customers');

    const user = await auth.getCurrentUser();
    this.setState({ user });

    let { data: brands } = await getUsers();
    this.setState({ brands });

    let { data: users } = await getCustomers();
    let { data: orders } = await getOrders();

    if (!user.isAdmin) {
      orders = orders.filter((o) => o.brandId === user._id);
    }
    this.setState({ orders, loading: false });

    if (!user.isAdmin) {
      let myCustomers = [];

      for (var i = 0; i < orders.length; i++) {
        if (i === 0) myCustomers.push(orders[i].userId);
        else if (myCustomers.indexOf(orders[i].userId) === -1)
          myCustomers.push(orders[i].userId);
      }

      let newCustomers = [];

      for (var x = 0; x < users.length; x++) {
        for (var j = 0; j < myCustomers.length; j++)
          if (users[x]._id === myCustomers[j]) newCustomers.push(users[x]);
      }

      users = newCustomers;
    }

    this.setState({ users });
  }

  handleChange = ({ currentTarget: input }) => {
    this.setState({ currentBrand: input.value });
  };

  getCustomers = (orders, users) => {
    let myCustomers = [];
    let newCustomers = users;

    for (let i = 0; i < orders.length; i++) {
      if (i === 0) myCustomers.push(orders[i].userId);
      else if (myCustomers.indexOf(orders[i].userId) === -1)
        myCustomers.push(orders[i].userId);
    }

    for (let x = 0; x < users.length; x++) {
      for (let j = 0; j < myCustomers.length; j++)
        if (users[x]._id === myCustomers[j]) newCustomers.push(users[x]);
    }

    return newCustomers;
  };

  // getFilteredCustomers = () => {
  //   let { orders, user, users, currentBrand } = this.state;

  //   // let myCustomers = [];
  //   let newCustomers = users;

  //   if (!user.isAdmin) {
  //     newCustomers = this.getCustomers(orders, users);
  //   }

  //   // if (currentBrand) {
  //   //   let myOrders = orders.filter((o) => o.brandId === currentBrand);
  //   //   newCustomers = this.getCustomers(myOrders, users);
  //   // }

  //   return { newCustomers };
  // };

  componentWillUnmount() {
    this.setState = (state, callback) => {
      return;
    };
  }

  render() {
    const { loading, users } = this.state;
    const { t } = this.props;
    // const { newCustomers: users } = this.getFilteredCustomers();
    let delay = 0.1;

    if (loading) return <Loader />;

    return (
      <div className='customers-page'>
        <div className='row'>
          <div className='col-md-12 p-2'>
            <div
              className='profile-right-block'
              style={{ animationDelay: '0.1s' }}
            >
              <h1>{ t('Customers')}</h1>
              <br />
              {/* {user.isAdmin && (
                <ChooseBrand
                  data={brands}
                  label={'Showing customers of '}
                  handleChange={this.handleChange}
                />
              )} */}
              <table className=' orders-table'>
                <thead>
                  <tr>
                    <th>{ t('Name')}</th>
                    <th className='hide-col'>{ t('Joined')}</th>
                    <th className='hide-col'>{ t('Email')}</th>
                    <th className='hide-col'>{ t('Orders')}</th>
                    <th>{ t('Information')}</th>
                  </tr>
                </thead>

                <tbody>
                  {users
                    // .filter((u) => !u.isAdmin)
                    .reverse()
                    .map((o) => (
                      <tr
                        key={o._id}
                        style={{ animationDelay: `${(delay += 0.1)}s` }}
                      >
                        <td>
                          <div className='cutomer'>
                            <div className='dashboard-customer-pic-circle'>
                              <h5>{o.name.charAt(0)}</h5>
                            </div>

                            {/* <div
                              className='customer-pic'
                              style={{
                                width: '50px',
                                height: '50px',
                                marginRight: '10px',
                                backgroundImage: 'url(' + o.profilePic + ')',
                              }}
                            ></div> */}
                            <p>{o.name !== '-' ? o.name : o.email}</p>
                          </div>
                        </td>
                        <td className='hide-col purchased-col'>
                          {moment(o.publishDate).fromNow()}
                        </td>
                        <td className='hide-col'>
                          <a href={'mailto:' + o.email}>{o.email}</a>
                        </td>
                        <td className='hide-col'>{this.totalOrders(o._id)}</td>
                        <td>
                          <Link to={`/dashboard/customers/customer/${o._id}`}>
                            <button className='view-order'>{ t('View')}</button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
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

export default Customers;
