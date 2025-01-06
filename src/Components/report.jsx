import React, { Component } from 'react';
import { getOrders } from '../services/orderService';
import moment from 'moment';
import auth from '../services/authService';
import Loader from './loader';
import DatePicker from './datePicker';
import generatePDF from '../services/reportGenerator';
import { getCustomers } from '../services/customerService';

class Report extends Component {
  state = {
    allStatus: ['Placed', 'Approved', 'Delivered', 'Recieved', 'Cancelled'],
    status: 'All',
    user: '',
    orders: [],
    users: [],
    loading: true,
    dates: [
      {
        startDate: new Date(),
        endDate: new Date(),
        key: 'selection',
      },
    ],
  };

  setDates = (dates) => {
    this.setState({ dates });
  };

  async componentDidMount() {
    window.scrollTo(0, 0);
    this.props.updateDashboardMenu('report');

    const allStatus = ['All', ...this.state.allStatus];
    this.setState({ allStatus });

    const user = auth.getCurrentUser();
    this.setState({ user });

    const { data: users } = await getCustomers();
    this.setState({ users });

    let { data: orders } = await getOrders();

    if (!user.isAdmin) {
      orders = orders.filter((o) => o.brandId === user._id);
    }

    this.setState({ orders, loading: false });
  }

  handleStatusSelect = (status) => {
    this.setState({
      status,
    });
  };

  getFilteredOrders = () => {
    const { orders, dates } = this.state;
    let start = moment(dates[0].startDate).format('ll');
    let end = moment(dates[0].endDate).format('ll');
    start = moment(start).subtract(1, 'days').format('ll');
    end = moment(end).add(1, 'days').format('ll');

    let filtered = orders;
    let filtered2 = [];

    for (var i = filtered.length - 1; i >= 0; i--) {
      filtered2.push(filtered[i]);
    }

    filtered = filtered2;

    filtered = filtered.filter((o) => {
      if (moment(moment(o.publishDate).format('ll')).isBetween(start, end))
        return o;
      return null;
    });

    return { filtered };
  };

  componentWillUnmount() {
    this.setState = (state, callback) => {
      return;
    };
  }

  render() {
    let index = 1;
    let { filtered: orders } = this.getFilteredOrders();
    const { loading, dates } = this.state;
    let delay = 0.1;

    if (loading) return <Loader />;

    return (
      <div className='customers-page orders'>
        <div className='row'>
          <div className='col-md-12 p-2'>
            <div
              className='profile-right-block'
              style={{ animationDelay: '0.1s' }}
            >
              <h1>Report</h1>

              <DatePicker dates={this.state.dates} setDates={this.setDates} />

              <table className=' orders-table'>
                <thead>
                <tr>
                    <th className='hide-col'>Index</th>
                    <th>Coupon</th>
                    <th>Buyer</th>
                    <th className='hide-col'>Purchased</th>
                    <th className='hide-col'>Status</th>
                    <th>Amount</th>
                  </tr>
                </thead>

                <tbody>
                  {orders.map((o) => (
                    <tr
                      key={o._id}
                      style={{ animationDelay: `${(delay += 0.1)}s` }}
                    >
                      <td className='hide-col'>{index++}</td>
                      <td>{o.coupon}</td>
                      <td>
                        <div className='cutomer'>
                          <span>{o.name}</span>
                        </div>
                      </td>
                      <td className='hide-col purchased-col'>
                        {moment(o.publishDate).format('lll')}
                      </td>
                      <td
                        className={
                          'hide-col order-status ' + o.orderStatus.toLowerCase()
                        }
                      >
                        <div className='hide-col'>{o.orderStatus}</div>
                      </td>
                      <td>
                        <span className='hide-col'>$</span>
                        <b>{o.offerPrice}</b>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <br />

              {orders.length > 0 && (
                <>
                  <div className='checkout-total totalreport'>
                    {/* <h5>Total</h5>
                    <h3>
                      <span>PKR</span> {this.calculateRevenue(orders)}
                    </h3> */}
                  </div>
                  <button
                    onClick={() =>
                      generatePDF(
                        orders,
                        this.state.user.name,
                        // this.calculateRevenue(orders),
                        moment(dates[0].startDate).format('ll'),
                        moment(dates[0].endDate).format('ll')
                      )
                    }
                  >
                    Download PDF report
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  buyerOfOrder = (id) => {
    const { users } = this.state;
    const user = users.filter((u) => u._id === id);

    return user[0];
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
}

export default Report;
