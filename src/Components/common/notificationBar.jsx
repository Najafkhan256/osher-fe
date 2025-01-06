import React, { Component } from 'react';

class NotificationBar extends Component {
  state = { loading: true };

  componentDidMount() {
    this.setState({ loading: true });

    setTimeout(() => this.setState({ loading: false }), 4000);
  }

  render() {
    const { loading } = this.state;
    const { message, img } = this.props;

    if (!loading) return null;

    return (
      <div className='notification-bar'>
       {img && <div
          className='notification-pic'
          style={{ backgroundImage: 'url(' + img + ')' }}
        ></div>}
        <h6>{message}</h6>
      </div>
    );
  }
}

export default NotificationBar;
