import React, { Component } from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import { getOrders, saveOrder } from '../services/orderService';
import { getUsers,  updatePayment } from '../services/userService';
import { getCustomers } from '../services/customerService';
import { Link } from 'react-router-dom';
import OrdersTable from './ordersTable';
import auth from '../services/authService';
import moment from 'moment';
import Loader from './loader';
import 'chartjs-plugin-deferred';
import BrandsTable from './brandsTable';

class DashboardOverview extends Component {
  
  state = {
    loading: true,
    orders: [],
    user: '',
    users: [],
    barChartData: {
      labels: ['11', '12', '13', '14', '29'],
      datasets: [
        {
          label: this.props.t('Coupons'),
          data: [12, 19, 3, 5, 2, 3],
          backgroundColor: 'rgb(255, 99, 132)',
        },
        // {
        //   label: 'Water',
        //   data: [2, 3, 20, 5, 1, 4],
        //   backgroundColor: 'rgb(54, 162, 235)',
        // },
        // {
        //   label: 'Juices',
        //   data: [3, 10, 13, 15, 22, 30],
        //   backgroundColor: 'rgba(255, 206, 86, 1)',
        // },
      ],
    },

    pieChartData: {
      labels: ['Used', 'Active', 'Expired'],
      datasets: [
        {
          label: 'Sales by category',
          backgroundColor: [
            'rgba(255, 206, 86, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 99, 132, 0.2)',
          ],
          hoverBackgroundColor: [
            'rgba(255, 206, 86, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 99, 132, 1)',
          ],
          data: [65, 30],
          borderWidth: 1,
        },
      ],
    },
  };

  async componentDidMount() {
    window.scrollTo(0, 0);
    this.props.updateDashboardMenu('dashboard');

    const user = await auth.getCurrentUser();
    this.setState({ user });

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

    this.setState({ users });

    let { data: customers } = await getCustomers();

    let { data: orders } = await getOrders();

    let revOrders = [];
    for (var xy = orders.length - 1; xy >= 0; xy--) {
      revOrders.push(orders[xy]);
    }
    orders = revOrders;

    if (!user.isAdmin) {
      orders = orders.filter((o) => o.brandId === user._id);
    }

    for (var v = 0; v < orders.length; v++) {
      if (
        new Date() - new Date(orders[v].expiryDate) > 0 &&
        orders[v].orderStatus !== 'Used'
      ) {
        orders[v].orderStatus = 'Expired';
        await saveOrder(orders[v]);
      }
    }

    if (!user.isAdmin) {
      let myCustomers = [];

      for (var i = 0; i < orders.length; i++) {
        if (i === 0) myCustomers.push(orders[i].userId);
        else if (myCustomers.indexOf(orders[i].userId) === -1)
          myCustomers.push(orders[i].userId);
      }

      let newCustomers = [];

      for (var x = 0; x < customers.length; x++) {
        for (var j = 0; j < myCustomers.length; j++)
          if (customers[x]._id === myCustomers[j])
            newCustomers.push(customers[x]);
      }

      customers = newCustomers;
    }

    this.setState({ orders, customers });

    // const coldDrinks = this.calculateTotalItems('Cold drink', orders);
    // const juices = this.calculateTotalItems('Juice', orders);
    // const water = this.calculateTotalItems('Water', orders);
    const used = orders.filter((o) => o.orderStatus === 'Used').length;
    const expired = orders.filter((o) => o.orderStatus === 'Expired').length;
    const unused = orders.filter((o) => o.orderStatus === 'Active').length;

    const pieChartData = { ...this.state.pieChartData };
    pieChartData.datasets[0].data = [used, unused, expired];

    const { dates, coupons: c } = this.populateDates(orders);
    const barChartData = { ...this.state.barChartData };
    barChartData.labels = dates;
    barChartData.datasets[0].data = c;

    // this.setState({ pieChartData, barChartData, loading: false });
    this.setState({ barChartData, loading: false });
    this.setState({ loading: false });
  }

  populateDates = (orders) => {
    let dates = [];

    let coupons = [];
    // let coldDrinks = [];
    // let juices = [];
    // let water = [];

    var x = 4;
    for (var i = 0; i < 5; i++)
      dates.push(
        moment()
          .subtract(x--, 'days')
          .toJSON()
      );

    for (const d of dates) {
      let ordersTemp = orders.filter(
        (o) =>
          moment(o.publishDate).format('MMMM Do YYYY') ===
          moment(d).format('MMMM Do YYYY')
      );
      const index = dates.indexOf(d);
      dates[index] = moment(d).format('D MMM');

      coupons.push(ordersTemp.length);
      // coldDrinks.push(this.calculateTotalItems('Cold drink', ordersTemp));
      // juices.push(this.calculateTotalItems('Juice', ordersTemp));
      // water.push(this.calculateTotalItems('Water', ordersTemp));
    }

    return { dates, coupons };
  };

  componentWillUnmount() {
    this.setState = (state, callback) => {
      return;
    };
  }

  render() {
    let { orders, user, loading, customers, users } = this.state;
    const { t } = this.props;

    if (loading) return <Loader />;

    return (
      <React.Fragment>
        <div className='row'>
          <div className='col-md-4 p-2'>
            <div
              className='profile-right-block'
              style={{ animationDelay: '0.3s' }}
            >
              <h1>{orders.filter((o) => o.orderStatus === 'Used').length}</h1>
              <h6>{t('Used Coupons')}</h6>
            </div>
          </div>

          <div className='col-md-4 p-2'>
            <div
              className='profile-right-block'
              style={{ animationDelay: '0.4s' }}
            >
              <h1>{orders.filter((o) => o.orderStatus === 'Active').length}</h1>
              <h6>{t('Unused Coupons')}</h6>
            </div>
          </div>

          <div className='col-md-4 p-2'>
            <div
              className='profile-right-block'
              style={{ animationDelay: '0.5s' }}
            >
              <h1>{orders.length}</h1>
              <h6>{t('Total Coupons')}</h6>
            </div>
          </div>
        </div>

        <div className='row'>
          <div className='col-md-6 p-2'>
            <div
              className='profile-right-block'
              style={{ animationDelay: '0.3s' }}
            >
              <h6>{t('Coupons by status')}</h6>
              <br />
              <Pie
                data={this.state.pieChartData}
                options={{
                  title: {
                    display: false,
                    text: 'Sales by category',
                  },
                  legend: {
                    display: true,
                    position: 'right',
                  },
                }}
              />
            </div>
          </div>

          <div className='col-md-6 p-2'>
            <div
              className='profile-right-block'
              style={{ animationDelay: '0.6s' }}
            >
              <h6>{t('Daily sales')}</h6>
              <br />

              <Bar
                data={this.state.barChartData}
                options={{
                  scales: {
                    yAxes: [
                      {
                        ticks: {
                          beginAtZero: true,
                        },
                      },
                    ],
                  },
                  plugins: {
                    deferred: {
                      xOffset: 150,
                      yOffset: '50%',
                      delay: 700,
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>

        <div className='row'>
          <div
            className={
              user.isAdmin || user.isBrand ? 'col-md-9 p-2' : 'col-md-12 p-2'
            }
          >
            <div
              className='profile-right-block'
              style={{ animationDelay: '0.7s' }}
            >
              <h6>{t('Recent orders')}</h6>
              <br />

              <OrdersTable data={orders} length={4} dateFromNow={true} />

              <div className='view-all-customers'>
                <Link to='/dashboard/orders'>
                  <button>{t('View all orders')}</button>
                </Link>
              </div>
            </div>
          </div>

          {(user.isAdmin || user.isBrand) && (
            <div className='col-md-3 p-2'>
              <div
                className='profile-right-block'
                style={{ animationDelay: '0.8s' }}
              >
                <h6>{t('Customers')}</h6>
                <br />
                {customers
                  .filter((u) => !u.isAdmin)
                  .slice(0, 5)
                  .map((u) => (
                    <React.Fragment key={u._id}>
                      <div
                        key={u._id}
                        className='cutomer'
                        style={{ marginBottom: '10px' }}
                      >
                        {/* <div
                          className='customer-pic'
                          style={{
                            backgroundImage: 'url(' + u.profilePic + ')',
                          }}
                        ></div> */}

                        <div className='dashboard-customer-pic-circle'>
                          <h5>{u.name.charAt(0)}</h5>
                        </div>
                        <p>{u.name !== '-' ? u.name : u.email}</p>
                      </div>
                      {/* <br /> */}
                    </React.Fragment>
                  ))}
                <br />
                <div className='view-all-customers'>
                  <Link to='/dashboard/customers'>
                    <button>{t('View all')}</button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>

        {user.isAdmin && (
          <div className='row'>
            <div className='col-md-12 p-2'>
              <div
                className='profile-right-block'
                style={{ animationDelay: '0.8s' }}
              >
                <h6>{t('Brands')}</h6>
                <br />

                <BrandsTable
                  data={users}
                  orders={orders}
                  customers={customers}
                  length={5}
                  dateFromNow={true}
                />

                <br />

                <div className='view-all-customers'>
                  <Link to='/dashboard/brands'>
                    <button>{t('View all brands')}</button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </React.Fragment>
    );
  }

  buyerOfOrder = (id) => {
    const { users } = this.state;
    const user = users.filter((u) => u._id === id);

    return user[0];
  };

  calculateTotalOrders = (id) => {
    const { orders } = this.state;

    return orders.filter((o) => o.brandId === id).length;
  };

  calculateTotalCustomers = (id) => {
    const { customers, orders } = this.state;

    const myOrders = orders.filter((o) => o.brandId === id);

    let myCustomers = [];

    for (var i = 0; i < myOrders.length; i++) {
      if (i === 0) myCustomers.push(myOrders[i].userId);
      else if (myCustomers.indexOf(myOrders[i].userId) === -1)
        myCustomers.push(myOrders[i].userId);
    }

    let newCustomers = [];

    for (var x = 0; x < customers.length; x++) {
      for (var j = 0; j < myCustomers.length; j++)
        if (customers[x]._id === myCustomers[j])
          newCustomers.push(customers[x]);
    }

    return myCustomers.length;
  };

  calculateTotal = (cartItems) => {
    let total = 0;
    for (const c of cartItems) total = total + c.product.price * c.quantity;
    return total;
  };

  calculateRevenue = (orders) => {
    let total = 0;

    for (const order of orders)
      for (const c of order.cartItems)
        total = total + c.product.price * c.quantity;

    return total;
  };

  calculateTotalItems = (type, orders) => {
    // const { orders } = this.state;

    let total = 0;

    for (const order of orders)
      for (const c of order.cartItems) {
        if (c.product.category === type) total = total + c.quantity;
      }

    return total;
  };
}

export default DashboardOverview;
