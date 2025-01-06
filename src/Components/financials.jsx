import React, { Component } from 'react';
import auth from '../services/authService';
import Loader from './loader';
import ChooseBrand from './common/chooseBrand';
import { getFinancials } from '../services/financialService';
import FinanceTable from './financeTable';

class Financials extends Component {
  state = {
    allStatus: [
      'Active',
      'Used',
      'Expired',
    ],
    user: '',
    orders: [],
    users: [],
    financials: [],
    status: 'All',
    loading: true,
    searchQuery: '',
    currentBrand: '',
  };

  async componentDidMount() {
    window.scrollTo(0, 0);
    this.props.updateDashboardMenu('financials');

    // const allStatus = ['All', ...this.state.allStatus];
    // this.setState({ allStatus });

    const user = auth.getCurrentUser();
    this.setState({ user });

    let { data: financials } = await getFinancials();

    if (!user.isAdmin) 
      financials = financials.filter(f=> f.brandId === user._id)

    this.setState({  financials, loading: false });
  }

  handleStatusSelect = (status) => {
    this.setState({
      status,
    });
  };

  handleSearch = (query) => {
    this.setState({
      searchQuery: query,
      status: 'All',
      // currentPage: 1,
    });
  };

  handleChange = ({ currentTarget: input }) => {
    this.setState({ currentBrand: input.value, status: 'All' });
  };

  getFilteredOrders = () => {
    const { user, currentBrand, financials } = this.state;

    let filtered = financials;

    if (user.isAdmin && currentBrand) {
      filtered = filtered.filter((o) => o.brandId === currentBrand);
    }

    let filtered2 = [];

    for (var i = filtered.length - 1; i >= 0; i--) {
      filtered2.push(filtered[i]);
    }

    filtered = filtered2;

    return { filtered };
  };

  componentWillUnmount() {
    this.setState = (state, callback) => {
      return;
    };
  }

  render() {
    let { filtered: financials } = this.getFilteredOrders();
    const {
      // status, allStatus,
      user,
      loading,
      // searchQuery,
      users,
    } = this.state;

    if (loading) return <Loader />;

    return (
      <div className='customers-page orders'>
        <div className='row'>
          <div className='col-md-12 p-2'>
            <div
              className='profile-right-block'
              style={{ animationDelay: '0.1s' }}
            >
              <h1>Financials</h1>

              <br />
              {user.isAdmin && (
                <ChooseBrand
                  data={users}
                  def={true}
                  label={'Showing finances of '}
                  handleChange={this.handleChange}
                />
              )}

              <FinanceTable data={financials} />

              <br/>
              <div className='total-financial-payments'>
                <h4>Total Payment</h4>
                <h3>$<b>{this.calculateTotal(financials)}</b></h3>
              </div>

              <br />
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
    for (const c of cartItems) total = total + parseInt(c.payment);
    return total;
  };
}

export default Financials;
