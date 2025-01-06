import React, { Component } from 'react';
import Joi from 'joi-browser';
import Input from './common/input';
import * as userService from '../services/userService';
import { withTranslation } from 'react-i18next';

class ForgotPasswordPage extends Component {
  state = {
    data: { username: '' },
    errors: {},
    isProcessing: false,
  };

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  schema = {
    username: Joi.string().required().label('Username'),
  };

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

  handleSubmit = (e) => {
    e.preventDefault();
    const errors = this.validate();
    this.setState({ errors: errors || {} });
    if (errors) return;

    this.doSubmit();
  };

  doSubmit = async () => {
    try {
      const { data } = this.state;
      this.setState({ isProcessing: true });
      const response = await userService.sendForgotPasswordLink(data);

      console.log(response);

      this.props.handleNotification({
        message: 'Password reset link sent!',
        img: '/img/success.png',
      });

      this.props.history.push('/login');
    } catch (ex) {
      if (
        (ex.response && ex.response.status === 400) ||
        (ex.response && ex.response.status === 403)
      ) {
        this.setState({ isProcessing: false });
        const errors = { ...this.state.errors };
        errors.username = ex.response.data;
        this.setState({ errors });
      }
    }
  };

  render() {
    const { data, errors, isProcessing } = this.state;
    const { t } = this.props;

    return (
      <div className='login-page'>
        <div className='row'>
          <div className='col-md-3'></div>

          <div className='col-md-6 login-page-form'>
            <h1>{t('Forgot your password')}?</h1>
            <form onSubmit={this.handleSubmit}>
              <Input
                type='text'
                placeholder={t('Username - Email')}
                name='username'
                value={data.username}
                onChange={this.handleChange}
                error={errors.username}
              />
              <button
                disabled={this.validate() || isProcessing}
                className='login-btn continue-to-shipping'
              >
                {!isProcessing ? (
                  t('Send Link')
                ) : (
                  <span>
                    {t('Sending')}... <i className='fas fa-circle-notch'></i>
                  </span>
                )}
              </button>
            </form>
          </div>

          <div className='col-md-3'></div>
        </div>
      </div>
    );
  }
}

export default withTranslation()(ForgotPasswordPage);
