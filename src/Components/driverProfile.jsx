import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { Redirect } from 'react-router-dom';
import { getOrders } from '../services/orderService';
import auth from '../services/authService';
import Loader from './loader';

class DriverProfile extends Component {
  state = { user: '', orders: [], loading: true };

  async componentDidMount() {
    window.scrollTo(0, 0);

    this.props.handleBack(true);
    this.setState({ loading: false });

    const user = await auth.getCurrentUser();
    this.setState({ user });

    let { data: orders } = await getOrders();

    if (!user.isAdmin) orders = orders.filter((o) => o.userId === user._id);

    this.setState({ orders });
  }

  render() {
    // const { user, orders, loading } = this.state;
    const { user, loading } = this.state;
    const { t } = this.props;

    if (auth.getCurrentUser().isAdmin || auth.getCurrentUser().isBrand)
      return <Redirect to='/dashboard' />;

    return (
      <div className='main-background'>
        <div className=' profile-page'>
          <div className=''>
            {loading ? (
              <Loader />
            ) : (
              <div className='row'>
                <div className='col-sm-6'>
                  <div className='profile-left-block'>
                    <h5>{t("You're riding with")}</h5>
                    <h1>
                      <b>{user.name}</b>
                    </h1>
                    <br />
                    <div
                      className='profile-pic-circle'
                      style={{
                        // backgroundImage: 'url(/img/tom.jpg)',
                        backgroundImage: 'url(' + user.profilePic + ')',
                      }}
                    ></div>
                  </div>
                </div>
                {!loading && (
                  <div className='col-sm-6'>
                    <div className='profile-right-box'>
                      <h1>
                        <b>{t("About Me")}</b>
                      </h1>

                      <h6 className='grey-text'>{t("Hometown")}</h6>
                      <h5>{user.address || 'Not set yet'}</h5>

                      <h6 className='grey-text'>{t("Favorite Food")}</h6>
                      <h5>{user.city || 'Not set yet'}</h5>

                      <h6 className='grey-text'>{t("Favorite Hobby")}</h6>
                      <h5>{user.country || 'Not set yet'}</h5>

                      <h6 className='grey-text'>{t("Favorite Sport or Team")}</h6>
                      <h5>{user.postalCode || 'Not set yet'}</h5>

                      <h6 className='grey-text'>{t("Ask me about")}</h6>
                      <h5>{user.phone || 'Not set yet'}</h5>

                      <h6 className='grey-text'>{t("My tips go towards")}</h6>
                      <h5>{user.trips || 'Not set yet'}</h5>
                    </div>
                    {/* <div className='row'>
                      <div className='col-sm-4 p-2'>
                        <div
                          className='profile-right-block'
                          style={{ animationDelay: '0.2s' }}
                        >
                          <h1>
                            24
                          </h1>
                          <h6>Unapproved orders</h6>
                        </div>
                      </div>

                      <div className='col-sm-4 p-2'>
                        <div
                          className='profile-right-block'
                          style={{ animationDelay: '0.3s' }}
                        >
                          <h1>
                            34
                          </h1>
                          <h6>Approved orders</h6>
                        </div>
                      </div>

                      <div className='col-sm-4 p-2'>
                        <div
                          className='profile-right-block'
                          style={{ animationDelay: '0.4s' }}
                        >
                          <h1>
                            23
                          </h1>
                          <h6>Cancelled orders</h6>
                        </div>
                      </div>
                    </div>

                    <div className='row'>
                      <div className='col-sm-4 p-2'>
                        <div
                          className='profile-right-block'
                          style={{ animationDelay: '0.4s' }}
                        >
                          <h1>
                            23
                          </h1>
                          <h6>Delivered orders</h6>
                        </div>
                      </div>

                      <div className='col-sm-4 p-2'>
                        <div
                          className='profile-right-block'
                          style={{ animationDelay: '0.5s' }}
                        >
                          <h1>
                            14
                          </h1>
                          <h6>Received orders</h6>
                        </div>
                      </div>

                      <div className='col-sm-4 p-2'>
                        <div
                          className='profile-right-block'
                          style={{ animationDelay: '0.6s' }}
                        >
                          <h1>438</h1>
                          <h6>Items sold</h6>
                        </div>
                      </div>
                    </div>

                    <div className='row'>
                      <div className='col-sm-8 p-2'>
                        <Link to='/dashboard'>
                          <div
                            className='profile-right-block'
                            style={{ animationDelay: '0.6s' }}
                          >
                            <h2>Dashboard</h2>
                            <h6>For detailed view</h6>
                          </div>
                        </Link>
                      </div>

                      <div className='col-sm-4 p-2'>
                        <Link to='/logout'>
                          <div
                            className='profile-right-block logout-block'
                            style={{ animationDelay: '0.7s' }}
                          >
                            <h2>Logout</h2>
                          </div>
                        </Link>
                      </div>
                    </div> */}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  calculateTotalItems = (orders) => {
    let items = 0;

    for (const order of orders)
      for (const c of order.cartItems) {
        // if (!items.includes(c.product)) {
        items = items + c.quantity;
        // items.push(c.product._id);
      }

    // const unique = new Set(items);
    // items = [...unique];

    return items;
  };
}

export default withTranslation()(DriverProfile);
