import React, { Component } from 'react';
import auth from '../services/authService';
import Loader from './loader';
// import SearchInput from './common/searchInput';
import Input from './common/input';
import {
  getLocation,
  saveLocation,
  getLocations,
} from '../services/locationService';

class Locations extends Component {
  state = {
    user: '',
    loading: true,
    locationInput: '',
    object: {
      id: '',
      person: '',
      branch: '',
      address: '',
      phone: '',
      email: '',
    },
    locations: [],
    locationObj: {
      locations: [],
      brandId: '',
    },
    deletePopup: false,
    updatePopup: false,
    updateRequestedOffer: {},
  };

  async componentDidMount() {
    window.scrollTo(0, 0);
    this.props.updateDashboardMenu('locations');

    const user = auth.getCurrentUser();
    this.setState({ user });

    // const res = await getLocation(user._id);
    // console.log(res)
    await this.populateLocations(user);

    this.setState({ loading: false });
  }

  async populateLocations(user) {
    try {
      if (user.isAdmin) {
        const { data } = await getLocations();
        console.log(data);

        this.setState({
          allLocations: data,
        });
      } else {
        const { data } = await getLocation(user._id);

        this.setState({
          locations: data.locations,
          locationObj: this.mapToViewModel(data),
        });
      }
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        // this.props.history.replace('/not-found');
        console.log(ex);
    }
  }

  mapToViewModel(location) {
    return {
      _id: location._id,
      brandId: location.brandId,
      locations: location.locations,
    };
  }

  handleDeletePopUp = (offer) => {
    this.setState({ deleteRequestedOffer: offer });

    let { deletePopup } = this.state;
    deletePopup = !deletePopup;
    this.setState({ deletePopup });
  };

  handleUpdatePopUp = (offer) => {
    // window.scrollTo(0, 0);
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
    this.setState({ object: offer });
  };

  handleStatusSelect = (status) => {
    this.setState({
      status,
    });
  };

  handleInput = ({ currentTarget: input }) => {
    const object = { ...this.state.object };
    object[input.name] = input.value;

    this.setState({ object });

    // this.setState({
    //   locationInput: location,
    // });
  };

  addLocation = async () => {
    let locations = [...this.state.locations];
    const { user, locationObj } = this.state;
    const object = { ...this.state.object };

    if (object.id) {
      for (var z = 0; z < locations.length; z++) {
        if (locations[z].id === object.id) locations[z] = object;
      }

      console.log(object);
      console.log(locations);
    } else {
      let maxId = 1;
      if (locations.length > 0) {
        maxId = Math.max.apply(
          Math,
          locations.map(function (o) {
            return o.id;
          })
        );

        maxId++;
      }

      object.id = maxId;

      locations.push(object);
      // locations.push(locationInput);
    }

    locationObj.locations = locations;
    locationObj.brandId = user._id;

    const { data } = await saveLocation(locationObj);

    this.setState({
      locations,
      // locationInput: '',
      object: {
        id: '',
        person: '',
        branch: '',
        address: '',
        phone: '',
        email: '',
      },
      locationObj: this.mapToViewModel(data),
    });
  };

  removeLocation = async (location) => {
    let locations = [...this.state.locations];
    const { user, locationObj } = this.state;

    locations = locations.filter((o) => o !== location);

    locationObj.locations = locations;
    locationObj.brandId = user._id;

    await saveLocation(locationObj);

    this.setState({ locations });
    this.handleDeletePopUp('');
  };

  isEmpty = () => {
    const { object } = this.state;
    if (
      object.person &&
      object.branch &&
      object.address &&
      object.email &&
      object.phone
    )
      return false;

    return true;
  };

  componentWillUnmount() {
    this.setState = (state, callback) => {
      return;
    };
  }

  render() {
    // let { filtered: orders } = this.getFilteredOrders();
    const {
      loading,
      locations,
      deletePopup,
      deleteRequestedOffer,
      object,
      user,
      allLocations,
    } = this.state;
    const {t} =this.props;

    if (loading) return <Loader />;

    return (
      <div className='customers-page orders'>
        {/* <div className='row'>
          <div className='col-md-12 p-2'> */}

        {deletePopup && (
          <React.Fragment>
            <div
              className='delete-popup-background'
              onClick={this.handleDeletePopUp}
            ></div>
            <div className='delete-pop-up'>
              <h5>{ t('Are you sure to remove this location')}?</h5>
              <div className='inner-pop'>
                <div className='inner-pop-text'>
                  <h2>
                    <span className='gray-span'>Branch:</span>{' '}
                    {deleteRequestedOffer.branch}
                  </h2>
                  {/* <h2>Offer: {deleteRequestedOffer.offerDetails}</h2> */}
                </div>
              </div>
              <button onClick={() => this.removeLocation(deleteRequestedOffer)}>
              { t('Yes')}
              </button>
              <button onClick={() => this.handleDeletePopUp('')}>{ t('No')}</button>
            </div>
          </React.Fragment>
        )}

        <div className='profile-right-block' style={{ animationDelay: '0.1s' }}>
          <h1>{ t('Locations')}</h1>
          <br />

          <div className='locations-page'>
            {user.isBrand && (
              <>
                <div className='location-input-block'>
                  <Input
                    type='text'
                    name='person'
                    className='form-control location-input'
                    placeholder={ t('Best person to reach (Name)')}
                    value={object.person}
                    onChange={this.handleInput}
                    // onChange={(e) => this.handleInput(e.currentTarget.value)}
                    autoFocus
                  />
                  <Input
                    type='text'
                    name='branch'
                    className='form-control location-input'
                    placeholder={ t('Branch name')}
                    value={object.branch}
                    onChange={this.handleInput}
                  />
                  <Input
                    type='text'
                    name='address'
                    className='form-control location-input'
                    placeholder={ t('Branch address')}
                    value={object.address}
                    onChange={this.handleInput}
                  />
                  <Input
                    type='text'
                    name='phone'
                    className='form-control location-input'
                    placeholder={ t('Branch phone number')}
                    value={object.phone}
                    onChange={this.handleInput}
                  />
                  <Input
                    type='text'
                    name='email'
                    className='form-control location-input'
                    placeholder={ t('Branch email')}
                    value={object.email}
                    onChange={this.handleInput}
                  />

                  <div>
                    <button
                      onClick={this.addLocation}
                      disabled={this.isEmpty()}
                    >
                      { t('Add Branch')}
                      
                    </button>
                    <span
                      onClick={() =>
                        this.setState({
                          object: {
                            id: '',
                            person: '',
                            branch: '',
                            address: '',
                            phone: '',
                            email: '',
                          },
                        })
                      }
                      style={{
                        marginLeft: '10px',
                        cursor: 'pointer',
                        // textDecoration: 'underline',
                      }}
                    >
                      { t('Clear')}
                      
                    </span>
                  </div>
                </div>
                <div className='linee'></div>
              </>
            )}

            <div className='locations'>
              {locations.map((l) => (
                <div className='location-box' key={l.id}>
                  <div>
                    <span>
                      <span className='light-text'>{ t('Person')}: </span>
                      {l.person}
                    </span>
                    <span>
                      <span className='light-text'>{ t('Branch')}: </span>
                      {l.branch}
                    </span>
                    <span>
                      <span className='light-text'>{ t('Address')}: </span>
                      {l.address}
                    </span>
                    <span>
                      <span className='light-text'>{ t('Phone')}: </span>
                      {l.phone}
                    </span>
                    <span>
                      <span className='light-text'>{ t('Email')}: </span>
                      {l.email}
                    </span>
                  </div>
                  <div>
                    <button
                      className='update-pro'
                      onClick={() => this.handleUpdatePopUp(l)}
                    >
{ t('Update')}
                    </button>
                    <button
                      className='delete-pro'
                      onClick={() => this.handleDeletePopUp(l)}
                    >
                      { t('Delete')}
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {user.isAdmin && (
              <div className='locations'>
                {allLocations.map((location) =>
                  location.locations.map((l) => (
                    <div className='location-box' key={l.id}>
                      <div>
                        <span>
                          <span className='light-text'>{ t('Person')}: </span>
                          {l.person}
                        </span>
                        <span>
                          <span className='light-text'>{ t('Branch')}: </span>
                          {l.branch}
                        </span>
                        <span>
                          <span className='light-text'>{ t('Address')}: </span>
                          {l.address}
                        </span>
                        <span>
                          <span className='light-text'>{ t('Phone')}: </span>
                          {l.phone}
                        </span>
                        <span>
                          <span className='light-text'>{ t('Email')}: </span>
                          {l.email}
                        </span>
                      </div>
                      <div>
                        {/* <button
                          className='update-pro'
                          onClick={() => this.handleUpdatePopUp(l)}
                        >
                          Update
                        </button>
                        <button
                          className='delete-pro'
                          onClick={() => this.handleDeletePopUp(l)}
                        >
                          Delete
                        </button> */}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      //   </div>
      // </div>
    );
  }
}

export default Locations;
