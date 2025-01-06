import React, { Component } from 'react';
// import { uploadImage } from '../services/fileService';
import { Redirect, Link } from 'react-router-dom';
import { storage } from '../firebase/firebase';
import Joi from 'joi-browser';
import Input from './common/input';
import * as userService from '../services/userService';
import auth from '../services/authService';

class UpdateDriverProfile extends Component {
  state = {
    isProcessing: false,
    file: '',
    imagePreviewUrl: '/img/ava3.jpg',
    data: {
      profilePic: '',
      email: '',
      password: '',
      name: '',
      phone: '',
      address: '',
      city: '',
      country: '',
      trips: '',
      postalCode: '',

      //   theme: '',
    },
    errors: {},
  };

  schema = {
    _id: Joi.string(),
    profilePic: Joi.string(),
    email: Joi.string().required().email().label('Username'),
    password: Joi.string().required().min(5).label('Password'),
    name: Joi.string().required().label('Name'),
    phone: Joi.string().label('Ask me about'),
    address: Joi.string().label('Hometown'),
    city: Joi.string().label('Favorite Food'),
    country: Joi.string().label('Favorite Hobby'),
    trips: Joi.string().label('Trips'),
    postalCode: Joi.string().label('Favorite Sports or Team'),
  };

  async componentDidMount() {
    window.scrollTo(0, 0);

    const user = auth.getCurrentUser();
    const id = user._id;

    const { data: res } = await userService.getMyDetails(id);
    this.setState({
      data: this.mapToViewModel(res),
      imagePreviewUrl: res.profilePic,
    });
  }

  mapToViewModel(user) {
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
      trips: user.trips || '',
      //   theme: user.theme,
    };
  }

  validate = () => {
    const options = { abortEarly: false };
    const { error } = Joi.validate(this.state.data, this.schema, options);
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

  handleChange = ({ currentTarget: input }) => {
    const errors = { ...this.state.errors };
    const errorMessage = this.validateProperty(input);
    if (errorMessage) errors[input.name] = errorMessage;
    else delete errors[input.name];

    const data = { ...this.state.data };
    data[input.name] = input.value;

    this.setState({ data, errors });
  };

  _handleImageChange = async (e) => {
    e.preventDefault();

    let image = e.target.files[0];

    const uploadTask = storage.ref(`images/${image.name}`).put(image);
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
          .child(image.name)
          .getDownloadURL()
          .then((url) => {
            this.setState({ imagePreviewUrl: url });
          });
      }
    );
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const errors = this.validate();
    this.setState({ errors: errors || {} });
    if (errors) return;

    this.doSubmit();
  };

  doSubmit = async () => {
    try {
      this.setState({ isProcessing: true });
      const { data, imagePreviewUrl } = this.state;
      data.profilePic = imagePreviewUrl;
      const response = await userService.updateUser(data);

      auth.logout();
      auth.loginWithJwt(response.headers['x-auth-token']);

      this.props.handleNotification({
        message: 'Profile updated successfully!',
        img: '/img/success.png',
      });

      this.props.updateUser();
      this.props.history.push('/profile');
      // window.location = '/';
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        this.setState({ isProcessing: false });
        const errors = { ...this.state.errors };
        errors.email = ex.response.data;
        this.setState({ errors });
      }
    }
  };

  render() {
    const {
      data,
      errors,
      imagePreviewUrl,
      file,
      loaded,
      isProcessing,
    } = this.state;

    if (!auth.getCurrentUser()) return <Redirect to='/login/' />;

    return (
      <div className='main-background'>
        <div
          className='login-page update-driver'
          style={{ marginTop: '-70px' }}
        >
          <div className='row'>
            <div className='col-md-3'></div>

            <div className='col-md-6 login-page-form'>
              <Link to='/profile'>
                <button className='back-btn'>
                  <i className='fas fa-angle-double-left'></i> Back
                </button>
              </Link>
              <h1>Update Driver Profile</h1>

              <div className='profile-pic-block'>
                <div
                  className='profile-pic-circle'
                  style={{ backgroundImage: 'url(' + imagePreviewUrl + ')' }}
                ></div>
                <div className='custom-file'>
                  <input
                    onChange={(e) => this._handleImageChange(e)}
                    type='file'
                    className='custom-file-input'
                    id='inputGroupFile01'
                  />
                  <label
                    className='custom-file-label'
                    htmlFor='inputGroupFile01'
                  >
                    {file ? file.name : 'Choose image'}
                  </label>
                </div>

                {loaded && (
                  <div className='progress'>
                    <div
                      className='progress-bar bg-success progress-bar-striped progress-bar-animated'
                      role='progressbar'
                      style={{ width: loaded + '%' }}
                      aria-valuenow={loaded}
                      aria-valuemin='0'
                      aria-valuemax='100'
                    >
                      {loaded > 0 && loaded + '%'}
                    </div>
                  </div>
                )}
              </div>

              <form onSubmit={this.handleSubmit}>
                <label htmlFor=''>Full Name</label>
                <Input
                  type='text'
                  placeholder='Name'
                  name='name'
                  value={data.name}
                  onChange={this.handleChange}
                  error={errors.name}
                />

                <label htmlFor=''>Email</label>
                <Input
                  type='text'
                  placeholder='Email'
                  name='email'
                  value={data.email}
                  onChange={this.handleChange}
                  error={errors.email}
                />

                <label htmlFor=''>Hometown</label>
                <Input
                  type='text'
                  placeholder='Hometown'
                  name='address'
                  value={data.address || ''}
                  onChange={this.handleChange}
                  error={errors.address}
                />

                <label htmlFor=''>Favorite Food</label>
                <Input
                  type='text'
                  placeholder='Favorite Food'
                  name='city'
                  value={data.city || ''}
                  onChange={this.handleChange}
                  error={errors.city}
                />

                <label htmlFor=''>Favorite Hobby</label>
                <Input
                  type='text'
                  placeholder='Favorite Hobby'
                  name='country'
                  value={data.country || ''}
                  onChange={this.handleChange}
                  error={errors.country}
                />

                <label htmlFor=''>Favorite Sports or Team</label>
                <Input
                  type='text'
                  placeholder='Favorite Sports or Team'
                  name='postalCode'
                  value={data.postalCode || ''}
                  onChange={this.handleChange}
                  error={errors.postalCode}
                />

                <label htmlFor=''>Ask me About</label>
                <Input
                  type='text'
                  placeholder='Ask me About'
                  name='phone'
                  value={data.phone || ''}
                  onChange={this.handleChange}
                  error={errors.phone}
                />

                <label htmlFor=''>My tips go towards</label>
                <Input
                  type='text'
                  placeholder='My tips go towards'
                  name='trips'
                  value={data.trips || ''}
                  onChange={this.handleChange}
                  error={errors.trips}
                />

                <Link to='/update-password'>
                  <button
                    style={{
                      width: '100%',
                      marginBottom: '-10px',
                      marginTop: '0px',
                    }}
                  >
                    Change password
                  </button>
                </Link>
                <button
                  disabled={isProcessing}
                  style={{ marginTop: '20px' }}
                  className='login-btn continue-to-shipping'
                >
                  {!isProcessing ? (
                    'Save'
                  ) : (
                    <span>
                      Saving... <i className='fas fa-circle-notch'></i>
                    </span>
                  )}
                </button>
              </form>
            </div>

            <div className='col-md-3'></div>
          </div>
        </div>
      </div>
    );
  }
}

export default UpdateDriverProfile;
