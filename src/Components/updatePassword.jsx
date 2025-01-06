import React, { Component } from 'react';
import Joi from 'joi-browser';
import Input from './common/input';
import * as userService from '../services/userService';
import auth from '../services/authService';
import { Link } from 'react-router-dom';

class UpdatePassword extends Component {
  state = {
    data: { oldpassword: '' },
    newData: { password: '', cpassword: '' },
    errors: {},
    userInfo: '',
    isProcessing: false,
  };

  userSchema = {
    oldpassword: Joi.string().required().min(5).max(15).label('Password'),
  };

  passwordSchema = {
    password: Joi.string().required().min(5).max(15).label('Password'),
    cpassword: Joi.any()
      .valid(Joi.ref('password'))
      .required()
      .label('Confirm Password')
      .options({ language: { any: { allowOnly: 'must match' } } }),

    // Joi.string().required().min(5).label('Confirm password'),
  };

  componentDidMount() {
    window.scrollTo(0, 0);
    this.setState({ userInfo: '' });
  }

  validate = () => {
    const options = { abortEarly: false };
    const { userInfo } = this.state;

    const { error } = Joi.validate(
      !userInfo ? this.state.data : this.state.newData,
      !userInfo ? this.userSchema : this.passwordSchema,
      options
    );
    if (!error) return null;

    const errors = {};
    for (let item of error.details) errors[item.path[0]] = item.message;
    return errors;
  };

  validateProperty = ({ name, value }) => {
    const obj = { [name]: value };
    const { userInfo } = this.state;

    const schema = {
      [name]: !userInfo ? this.userSchema[name] : this.passwordSchema[name],
    };
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

    const { userInfo } = this.state;

    if (!userInfo) {
      const data = { ...this.state.data };
      data[input.name] = input.value;
      this.setState({ data, errors });
    } else {
      const newData = { ...this.state.newData };
      newData[input.name] = input.value;

      const { password } = this.state.newData;
      if (input.value === password) delete errors[input.name];
      this.setState({ newData, errors });
    }
  };

  doSubmit = async () => {
    let { userInfo } = this.state;

    if (!userInfo) {
      try {
        const { data } = this.state;
        const user = auth.getCurrentUser();
        user.password = data.oldpassword;

        const response = await userService.getCurrentPassword(user);
        userInfo = response.data;
        this.setState({ userInfo });
      } catch (ex) {
        if (
          (ex.response && ex.response.status === 400) ||
          (ex.response && ex.response.status === 404)
        ) {
          const errors = { ...this.state.errors };
          errors.oldpassword = ex.response.data;
          this.setState({ errors });
        }
      }
    } else {
      const { password } = this.state.newData;
      this.setState({ isProcessing: true });
      userInfo.password = password;

      await userService.updateUser(userInfo);

      this.props.handleNotification({
        message: 'Password updated successfully!',
        img: '/img/success.png',
      });

      this.props.history.push('/update-profile/');
    }
  };

  render() {
    const { data, errors, userInfo, newData, isProcessing } = this.state;
    return (
      // <div className='main-background'>
        <div className='login-page'>
          <div className='row'>
            <div className='col-md-3'></div>

            <div className='col-md-6 login-page-form'>
              <Link to='/update-profile'>
                <button className='back-btn'>
                  <i className='fas fa-angle-double-left'></i> Back
                </button>
              </Link>

              <h1>Change password</h1>
              <form onSubmit={this.handleSubmit}>
                {!userInfo && (
                  <React.Fragment>
                    <label htmlFor=''>Enter your current password</label>

                    <Input
                      type='password'
                      placeholder='Current password'
                      name='oldpassword'
                      value={data.oldpassword}
                      onChange={this.handleChange}
                      error={errors.oldpassword}
                    />
                    <button disabled={this.validate()} className='login-btn'>
                      Continue
                    </button>
                  </React.Fragment>
                )}

                {userInfo && (
                  <div className='new-password-block'>
                    <label htmlFor=''>Enter new password</label>
                    <Input
                      type='password'
                      placeholder='New password'
                      name='password'
                      value={newData.password}
                      onChange={this.handleChange}
                      error={errors.password}
                    />
                    <Input
                      type='password'
                      placeholder='Confirm password'
                      name='cpassword'
                      value={newData.cpassword}
                      onChange={this.handleChange}
                      error={errors.cpassword}
                    />

                    <button
                      disabled={this.validate() || isProcessing}
                      className='login-btn  continue-to-shipping'
                    >
                      {!isProcessing ? (
                        'Set Password'
                      ) : (
                        <span>
                          Setting Password...{' '}
                          <i className='fas fa-circle-notch'></i>
                        </span>
                      )}
                    </button>
                  </div>
                )}
              </form>
            </div>

            <div className='col-md-3'></div>
          </div>
        </div>
      // </div>
    );
  }
}

export default UpdatePassword;
