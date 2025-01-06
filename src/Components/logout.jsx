import { Component } from 'react';
import auth from '../services/authService';

class Logout extends Component {
  componentDidMount() {
    auth.logout();
    this.props.handleBack(this.props.history.goBack);
    this.props.updateUser();
    this.props.history.push('/');
  }

  render() {
    
    return null;
  }
}

export default Logout;
