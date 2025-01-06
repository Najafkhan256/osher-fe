import React, { Component } from 'react';
import { saveProduct, getProduct } from '../services/productService';
// import { uploadImage } from '../services/fileService';
import { Link } from 'react-router-dom';
import { Calendar } from 'react-date-range';
import { getLocation } from '../services/locationService';
import { storage } from '../firebase/firebase';
import Joi from 'joi-browser';
import Input from './common/input';
import Select from './common/select';
import categories from '../services/categories';
import TextArea from './common/textArea';
import auth from '../services/authService';
import { getUsers } from '../services/userService';
import moment from 'moment';
import Loader from './loader';
import ChooseBrand from './common/chooseBrand';
import { getVideos } from '../services/videoService';
import ChooseVideo from './common/chooseVideo';

class AddNewProduct extends Component {
  state = {
    file: '',
    imagePreviewUrl: '/img/img1.jpg',
    currentBrand: '',
    product: {
      name: '',
      brandId: '',
      category: '',
      details: '',
      description: '',
      inStock: '',
      img: [],
      offers: [],
    },
    categories: [],
    errors: {},
    heading: 'Add New Bundle',
    offers: [
      {
        id: 1,
        offerDetails: '',
        price: '',
      },
    ],
    img: [],
    deletePopup: false,
    loaded: 0,
    locations: [],
    activeLocations: [],
    videos: [],
    expiryDate: new Date(),
    loading: true,
  };

  schema = {
    _id: Joi.string(),
    name: Joi.string().required().label('Name'),
    size: Joi.string().required().label('Size'),
    category: Joi.string().required().label('Category'),
    details: Joi.string().required().label('Details'),
    description: Joi.string().required().label('Description'),
    inStock: Joi.number().min(0).max(10000).required().label('Stock quantity'),
  };

  async populateProducts() {
    try {
      const productId = this.props.match.params.id;
      if (productId) {
        if (productId === 'new') return;

        const { data: product } = await getProduct(productId);
        this.setState({
          activeLocations: product.branches,
          expiryDate: new Date(product.expiryDate),
          product: this.mapToViewModel(product),

          // imagePreviewUrl: product.img,
          img: product.img,
          offers: product.offers,
          heading: 'Update Bundle',
          loading: false,
        });

        const { user } = this.state;
        if (user.isAdmin) {
          // const { data: users } = await getUsers();

          this.setState({
            currentBrand: product.brandId,
            currentVideo: product.video,
            // users,
            // currentBrand: users.filter((u) => u.isBrand)[0]._id,
          });
          await this.populateLocations(product.brandId);
        }
      } else this.setState({ loading: false });
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        this.props.history.replace('/not-found');
    }
  }

  async populateLocations(currentBrand) {
    try {
      const user = auth.getCurrentUser();
      const id = user._id;

      let response;

      if (user.isAdmin) response = await getLocation(currentBrand);
      else response = await getLocation(id);

      this.setState({
        locations: response.data.locations,
      });

      if (!this.props.match.params.id)
        this.setState({
          activeLocations: response.data.locations,
        });
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        this.setState({
          locations: [],
          activeLocations: [],
        });
    }
  }

  populateCategories() {
    // const categories = categories;
    let cat = categories.filter((c) => c !== 'All');
    this.setState({ categories: cat });
  }

  async componentDidMount() {
    window.scrollTo(0, 0);
    const user = auth.getCurrentUser();
    this.setState({ user });

    if (user.isAdmin) {
      const { data: users } = await getUsers();
      const { data: videos } = await getVideos();
      console.log(videos);
      this.setState({ users, videos });

      if (!this.props.match.params.id) {
        this.setState({
          currentBrand: users.filter((u) => u.isBrand)[0]._id,
          currentVideo: videos[0]._id,
        });

        await this.populateLocations(users.filter((u) => u.isBrand)[0]._id);
      }
    }

    if (!user.isAdmin) await this.populateLocations('');

    this.populateCategories();
    await this.populateProducts();
  }

  mapToViewModel(product) {
    return {
      _id: product._id,
      name: product.name,
      video: product.video,
      category: product.category,
      brandId: product.brandId,
      details: product.details,
      description: product.description,
      img: product.img,
      offers: product.offers,
      inStock: product.inStock,
      branches: product.branches,
      expiryDate: product.expiryDate,
    };
  }

  handleDeletePopUp = (offer) => {
    this.setState({ deleteRequestedOffer: offer });

    let { deletePopup } = this.state;
    deletePopup = !deletePopup;
    this.setState({ deletePopup });
  };

  validate = () => {
    const options = { abortEarly: false };
    const { error } = Joi.validate(this.state.product, this.schema, options);
    if (!error) return null;

    const errors = {};
    for (let item of error.details) errors[item.path[0]] = item.message;
    return errors;
  };

  validateProperty = ({ name, value }) => {
    const obj = { [name]: value };
    const schema = { [name]: this.schema[name] };
    const { error } = Joi.validate(obj, schema);
    return error ? error.details[0].message : null;
  };

  addOffer = () => {
    let offers = [...this.state.offers];
    let maxId = 1;
    if (offers.length > 0) {
      maxId = Math.max.apply(
        Math,
        offers.map(function (o) {
          return o.id;
        })
      );

      maxId++;
    }

    offers.push({ id: maxId, offerDetails: '', price: '' });

    this.setState({ offers });
  };

  removeOffer = (offer) => {
    let offers = [...this.state.offers];
    offers = offers.filter((o) => o !== offer);
    this.setState({ offers });
    this.handleDeletePopUp('');
  };

  handleChooseBrand = async ({ currentTarget: input }) => {
    this.setState({ currentBrand: input.value });
    await this.populateLocations(input.value);
  };

  handleChooseVideo = async ({ currentTarget: input }) => {
    this.setState({ currentVideo: input.value });
  };

  handleChange = ({ currentTarget: input }) => {
    const errors = { ...this.state.errors };
    const errorMessage = this.validateProperty(input);

    if (errorMessage) errors[input.name] = errorMessage;
    else delete errors[input.name];

    const product = { ...this.state.product };
    product[input.name] = input.value;

    this.setState({ product, errors });
  };

  handleOfferChange = ({ currentTarget: input }, offer) => {
    // const errors = { ...this.state.errors };
    // const errorMessage = this.validateProperty(input);

    // if (errorMessage) errors[input.name] = errorMessage;
    // else delete errors[input.name];

    const offers = [...this.state.offers];
    const index = offers.indexOf(offer);
    offers[index][input.name] = input.value;

    this.setState({ offers });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const errors = this.validate();
    this.setState({ errors: errors || {} });
    // if (errors) return;

    this.doSubmit();
  };

  doSubmit = async () => {
    const {
      product,
      img,
      offers,
      user,
      activeLocations,
      expiryDate,
      currentBrand,
      currentVideo
    } = this.state;
    product.img = img;
    product.offers = offers;
    if (user.isAdmin) product.brandId = currentBrand;
    if (user.isAdmin) product.video = currentVideo;
    else product.brandId = user._id;
    product.branches = activeLocations;
    product.expiryDate = expiryDate;

    await saveProduct(product);

    let message = 'Product added successfully!';

    if (this.props.match.params.id) message = 'Product updated successfully!';

    this.props.handleNotification({
      message: message,
      img: '/img/success.png',
    });

    this.props.history.push('/dashboard/products/');
  };

  _handleImageChange = (e) => {
    e.preventDefault();

    this.setState({
      // file,
      loaded: 1,
    });

    let file = e.target.files[0];

    const uploadTask = storage.ref(`images/${file.name}`).put(file);
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        this.setState({ loaded: progress });
      },
      (error) => {
        console.log(error);
      },
      () => {
        storage
          .ref('images')
          .child(file.name)
          .getDownloadURL()
          .then((url) => {
            const img = [...this.state.img];
            img.push(url);
            this.setState({ img, loaded: 0 });
            // this.setState({ imagePreviewUrl: url });
          });
      }
    );
  };

  removeImage = (image) => {
    let img = [...this.state.img];
    console.log(image);
    img = img.filter((o) => o !== image);
    this.setState({ img });
  };

  isActive = (location) => {
    const { activeLocations } = this.state;
    let classes = 'branch branch-active';

    const result = activeLocations.filter((l) => l.id === location.id);

    if (result.length === 0) classes = 'branch';

    return classes;
  };

  setDate = (date) => {
    console.log(date);
    this.setState({ expiryDate: date });
  };

  selectBranch = (location) => {
    let activeLocations = [...this.state.activeLocations];
    // let classes = 'branch branch-active'
    console.log(location);
    const result = activeLocations.filter((l) => l.id === location.id);

    if (result.length === 0) activeLocations.push(location);
    else activeLocations = activeLocations.filter((l) => l.id !== location.id);

    this.setState({ activeLocations });
  };

  render() {
    // let { imagePreviewUrl, file } = this.state;
    const {
      product,
      errors,
      offers,
      categories,
      heading,
      img,
      deletePopup,
      deleteRequestedOffer,
      loaded,
      locations,
      expiryDate,
      loading,
      user,
      currentBrand,
      videos,
      currentVideo,
      users,
    } = this.state;

    if (loading) return <Loader />;

    return (
      <div className='container add-product-page'>
        {deletePopup && (
          <React.Fragment>
            <div
              className='delete-popup-background'
              onClick={this.handleDeletePopUp}
            ></div>
            <div className='delete-pop-up'>
              <h5>Are you sure to remove this offer?</h5>
              <div className='inner-pop'>
                <div className='inner-pop-text'>
                  <h2>
                    <span className='gray-span'>Offer id: </span>
                    {deleteRequestedOffer.id}
                  </h2>
                  <h2>
                    <span className='gray-span'>Offer: </span>
                    {deleteRequestedOffer.offerDetails}
                  </h2>
                </div>
              </div>
              <button onClick={() => this.removeOffer(deleteRequestedOffer)}>
                Yes
              </button>
              <button onClick={() => this.handleDeletePopUp('')}>No</button>
            </div>
          </React.Fragment>
        )}
        <h1>{heading}</h1>
        <div className='row'>
          <div className='col-md-7 add-product-form'>
            {user.isAdmin && (
              <ChooseBrand
                data={users}
                value={currentBrand}
                label={'Choosed brand'}
                handleChange={this.handleChooseBrand}
              />
            )}
            {user.isAdmin && (
              <ChooseVideo
                data={videos}
                value={currentVideo}
                label={'Choose Video'}
                handleChange={this.handleChooseVideo}
              />
            )}
            <form onSubmit={this.handleSubmit}>
              <label htmlFor=''>Bundle Name</label>
              <Input
                type='text'
                placeholder='Bundle Name'
                name='name'
                value={product.name}
                onChange={this.handleChange}
                error={errors.name}
              />

              <Select
                options={categories}
                name='category'
                value={product.category}
                def={true}
                label='Category'
                onChange={this.handleChange}
                error={errors.category}
              />

              <label htmlFor=''>Choose Images (Max 5)</label>
              <div className='add-images-block'>
                {img.map((i) => (
                  <div className='img-box' key={i}>
                    <div
                      className='remove-img-btn'
                      onClick={() => this.removeImage(i)}
                    >
                      X
                    </div>
                    <img src={i} alt={i} />
                  </div>
                ))}
                {loaded > 0 && (
                  <div className='img-uploading-box'>
                    <div className='progress' style={{ width: '100%' }}>
                      <div
                        className='progress-bar bg-warning progress-bar-striped progress-bar-animated'
                        role='progressbar'
                        style={{ width: this.state.loaded + '%' }}
                        aria-valuenow={this.state.loaded}
                        aria-valuemin='0'
                        aria-valuemax='100'
                      >
                        {/* {this.state.loaded > 0 && this.state.loaded + '%'} */}
                      </div>
                    </div>
                  </div>
                )}

                {img.length < 5 && (
                  <label className='image-input-label'>
                    {/* + */}
                    <i className='far fa-image'></i>
                    {img.length < 1 ? <p>Add Cover Image</p> : <p>Add Image</p>}
                    <input
                      type='file'
                      size='60'
                      onChange={this._handleImageChange}
                    />
                  </label>
                )}
              </div>

              <label htmlFor=''>Details</label>
              <TextArea
                type='text'
                placeholder='Details'
                name='details'
                value={product.details}
                onChange={this.handleChange}
                error={errors.details}
              />

              <label htmlFor=''>Description</label>
              <TextArea
                type='text'
                placeholder='Description'
                name='description'
                value={product.description}
                onChange={this.handleChange}
                error={errors.description}
              />

              <label htmlFor=''>Branches</label>
              <div className='branches-block'>
                {locations.map((l) => (
                  <div
                    onClick={() => this.selectBranch(l)}
                    className={this.isActive(l)}
                    key={l.id}
                  >
                    {l.address}
                  </div>
                ))}
              </div>

              <label htmlFor=''>Quantity in Stock</label>
              <Input
                type='number'
                placeholder='Quantity in Stock'
                name='inStock'
                value={product.inStock}
                onChange={this.handleChange}
                error={errors.inStock}
              />

              <button className='login-btn'>Save</button>
            </form>
            <Link to='/dashboard/products/'>
              <button className='cancel-btn'>Cancel</button>
            </Link>
          </div>

          <div className='col-md-5 product-image'>
            <div className='extendable-offers' style={{ width: '100%' }}>
              {offers.map((o) => (
                <div key={o.id} className='offer-input-block'>
                  <div style={{ width: '100%' }}>
                    <p>Offer Id: {o.id}</p>
                    <Input
                      type='text'
                      placeholder='Offer details'
                      name='offerDetails'
                      value={o.offerDetails}
                      onChange={(e) => this.handleOfferChange(e, o)}
                      // error={errors.label}
                    />
                    <Input
                      type='text'
                      placeholder='Price'
                      name='price'
                      value={o.price}
                      onChange={(e) => this.handleOfferChange(e, o)}
                      // error={errors.label}
                    />
                    <div className='linee'></div>
                  </div>
                  <button onClick={() => this.handleDeletePopUp(o)}>
                    {/* <button onClick={() => this.removeOffer(o)}> */}
                    <i className='far fa-trash-alt'></i>
                  </button>
                </div>
              ))}
              {offers.length < 5 && (
                <button className='login-btn' onClick={this.addOffer}>
                  Add Offer
                </button>
              )}

              <div className='choose-expiry-date'>
                <div className='linee'></div>
                <h3>
                  <span>Expires on: </span>
                  {moment(expiryDate).format('ll')}
                </h3>
                <Calendar
                  onChange={(item) => this.setDate(item)}
                  date={expiryDate}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default AddNewProduct;
