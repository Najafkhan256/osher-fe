import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { deleteProduct, getProducts } from '../services/productService';
import DeletePopUp from './deletePopup';
import Loader from './loader';
import auth from '../services/authService';

class ProductsDashboard extends Component {
  state = {
    user: '',
    loading: false,
    deleteRequestedProduct: {},
    deletePopup: false,
  };

  async componentDidMount() {
    window.scrollTo(0, 0);
    this.props.updateDashboardMenu('products');

    const user = auth.getCurrentUser();
    this.setState({ user });

    let { data: products } = await getProducts();

    if (!user.isAdmin) {
      products = products.filter((p) => p.brandId === user._id);
    }

    this.setState({ products, loading: true });
  }

  componentWillUnmount() {
    this.setState = (state, callback) => {
      return;
    };
  }

  handleDelete = async (product) => {
    const originalProducts = this.state.products;
    const products = originalProducts.filter((p) => p._id !== product._id);
    this.setState({ products });

    try {
      await deleteProduct(product._id);
      // await this.props.updateOnApp();
    } catch (ex) {
      //   if (ex.response && ex.response.status === 404)
      //     toast.error('Product already deleted.');
      this.setState({ products: originalProducts });
    }

    this.setState({ deleteRequestedProduct: {}, deletePopup: false });
  };

  handleDeletePopUP = (product) => {
    this.setState({ deleteRequestedProduct: product });

    let { deletePopup } = this.state;
    deletePopup = !deletePopup;
    this.setState({ deletePopup });
  };

  render() {
    let { products, loading, deletePopup, deleteRequestedProduct } = this.state;

    if (!loading) return <Loader />;

    return (
      <div className='customers-page'>
        {deletePopup && (
          <DeletePopUp
            deleteRequestedProduct={deleteRequestedProduct}
            handleDeletePopUP={this.handleDeletePopUP}
            handleDelete={this.handleDelete}
          />
        )}
        <div className='row'>
          <div className='col-md-12 p-2'>
            <div
              className='profile-right-block'
              style={{ animationDelay: '0.1s' }}
            >
              <h1>Products</h1>

              <div className='new-pro'>
                <Link to='/add-new-product/'>
                  <button>Add new Bundle</button>
                </Link>
              </div>
              {loading && (
                <table className=' orders-table'>
                  <thead>
                    <tr>
                      <th>Bundle</th>
                      <th className='hide-col'>Offers</th>
                      <th className='hide-col'>Price</th>

                      <th></th>
                      <th></th>
                    </tr>
                  </thead>

                  <tbody>
                    {products.map((o) => (
                      <tr key={o._id}>
                        <td>
                          <div className='item-pic'>
                            {/* <Link to={'/products/product/' + o._id}> */}
                              {/* <img
                              src={o.imageUrl}
                              alt='pic'
                              style={{ marginRight: '7px' }}
                              /> */}
                            {/* </Link> */}
                            {/* <Link
                              className='hide-col'
                              to={'/products/product/' + o._id}
                            > */}
                              {o.name}
                            {/* </Link> */}
                          </div>
                        </td>

                        <td className='hide-col'>
                          {o.offers.length}
                          {/* {o.offers.length <= 5 && (
                            <span
                              style={{ color: '#e20606', fontSize: '30px' }}
                            >
                              {' '}
                              *
                            </span>
                          )} */}
                        </td>
                        <td className='hide-col'>${o.offers[0].price}</td>

                        <td>
                          <Link to={`/add-new-product/${o._id}`}>
                            <button className='update-pro'>Update</button>
                          </Link>
                        </td>
                        <td>
                          <button
                            onClick={() => this.handleDeletePopUP(o)}
                            className='delete-pro'
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
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
    for (const c of cartItems) total = total + c.product.price * c.quantity;
    return total;
  };
}

export default ProductsDashboard;
