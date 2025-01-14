import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import Joi from 'joi-browser';
import Input from './common/input';
import auth from '../services/authService';
import * as userService from '../services/userService';

class SignupPage extends Component {
  state = {
    data: { username: '', password: '', name: '', profilePic: '/img/ava3.jpg' },
    errors: {},
    isProcessing: false,
  };

  schema = {
    username: Joi.string().required().email().label('Username'),
    password: Joi.string().required().min(5).label('Password'),
    name: Joi.string().required().label('Name'),
    profilePic: Joi.string().label('Profile Pic'),
  };

  componentDidMount() {
    window.scrollTo(0, 0);
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

  handleSubmit = (e) => {
    e.preventDefault();
    const errors = this.validate();
    this.setState({ errors: errors || {} });
    if (errors) return;

    this.doSubmit();
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

  doSubmit = async () => {
    try {
      this.setState({ isProcessing: true });
      const { data } = this.state;
      data.profilePic = '/img/ava3.jpg';

      const response = await userService.register(data);
      auth.loginWithJwt(response.headers['x-auth-token']);

      this.props.handleNotification({
        message: 'Welcome, ' + data.name + '!',
        img: data.profilePic,
      });

      const { state } = this.props.location;

      this.props.updateUser();
      this.props.history.push(state ? state.from.pathname : '/');

      // window.location = '/';
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        this.setState({ isProcessing: false });
        const errors = { ...this.state.errors };
        errors.username = ex.response.data;
        this.setState({ errors });
      }
    }
  };

  render() {
    const { data, errors, isProcessing } = this.state;

    if (auth.getCurrentUser()) return <Redirect to='/' />;

    return (
      <div className='main-background'>
        <div className='login-page'>
          <div className='row'>
            <div className='col-md-3'></div>

            <div className='col-md-6 login-page-form'>
              <h1>Create Driver Account</h1>

              <p>
                Already have an account?{' '}
                <Link to='/login/'>
                  <i>Login</i>
                </Link>
              </p>
              <form onSubmit={this.handleSubmit}>
                <Input
                  type='text'
                  placeholder='Name'
                  name='name'
                  value={data.name}
                  onChange={this.handleChange}
                  error={errors.name}
                />

                <Input
                  type='text'
                  placeholder='Username'
                  name='username'
                  value={data.username}
                  onChange={this.handleChange}
                  error={errors.username}
                />

                <Input
                  type='password'
                  placeholder='Password'
                  name='password'
                  value={data.password}
                  onChange={this.handleChange}
                  error={errors.password}
                />

                <button
                  disabled={this.validate() || isProcessing}
                  className='login-btn continue-to-shipping'
                >
                  {!isProcessing ? (
                    'Create'
                  ) : (
                    <span>
                      Creating... <i className='fas fa-circle-notch'></i>
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

export default SignupPage;
