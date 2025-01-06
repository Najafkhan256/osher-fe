import React, { Component } from 'react';
import { saveVideo, getVideos, deleteVideo } from '../services/videoService';
import { storage } from '../firebase/firebase';
import auth from '../services/authService';
import Loader from './loader';
import Input from './common/input';
import Select from './common/select';
import categories from '../services/categories';
import moment from 'moment';

class VideosPage extends Component {
  state = {
    user: '',
    loading: true,
    locationInput: '',
    loaded: 0,

    object: {
      _id: '',
      name: '',
      category: '',
      videoUrl: '',
      views: '',
      publishDate: '',
    },
    allVideos: [],
    video: '',
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
    this.props.updateDashboardMenu('videos');

    const user = auth.getCurrentUser();
    this.setState({ user });

    // const res = await getLocation(user._id);
    // console.log(res)
    await this.populateLocations();

    this.setState({ loading: false });
  }

  async populateLocations() {
    try {
      const { data } = await getVideos();

      this.setState({
        allVideos: data,
      });
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        // this.props.history.replace('/not-found');
        console.log(ex);
    }
  }

  mapToViewModel(location) {
    return {
      _id: location._id,

      name: location.name,
      views: location.views,
      category: location.category,
      videoUrl: location.videoUrl,
      publishDate: location.publishDate,
    };
  }

  handleDeletePopUp = (offer) => {
    this.setState({ deleteRequestedOffer: offer });

    let { deletePopup } = this.state;
    deletePopup = !deletePopup;
    this.setState({ deletePopup });
  };

  handleUpdatePopUp = (offer) => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
    this.setState({ object: offer, video: offer.videoUrl });
  };

  handleInput = ({ currentTarget: input }) => {
    const object = { ...this.state.object };
    object[input.name] = input.value;

    this.setState({ object });
  };

  handleChange = ({ currentTarget: input }) => {
    const object = { ...this.state.object };
    object[input.name] = input.value;

    this.setState({ object });
  };

  addVideo = async () => {
    let allVideos = [...this.state.allVideos];
    // const { user, locationObj } = this.state;
    const object = { ...this.state.object };
    object.videoUrl = this.state.video;
    object.views = object.views || 0;
    if (!object._id) delete object._id;
    if (!object.publishDate) delete object.publishDate;

    const { data } = await saveVideo(object);

    var found = false;
    for (var z = 0; z < allVideos.length; z++) {
      if (allVideos[z]._id === object._id) {
        allVideos[z] = data;
        found = true;
      }
    }

    if (!found) allVideos.push(data);

    this.setState({
      video: null,
      allVideos,
      object: {
        _id: '',
        name: '',
        category: '',
        videoUrl: '',
        views: '',
        publishDate: '',
      },
    });
  };

  _handleImageChange = (e) => {
    e.preventDefault();

    this.setState({
      // file,
      loaded: 0.1,
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
            const object = { ...this.state.object };
            object.videoUrl = url;
            this.setState({ video: url, object, loaded: 0 });
            // this.setState({ imagePreviewUrl: url });
          });
      }
    );
  };

  removeImage = () => {
    const object = { ...this.state.object };
    object.videoUrl = null;
    this.setState({ video: null, object });
  };

  removeLocation = async (currentVideo) => {
    let allVideos = [...this.state.allVideos];

    allVideos = allVideos.filter((video) => video._id !== currentVideo._id);

    await deleteVideo(currentVideo._id);

    this.setState({ allVideos });
    this.handleDeletePopUp('');
  };

  isEmpty = () => {
    const { object } = this.state;
    if (object.name && object.videoUrl && object.category) return false;

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
      video,
      loaded,
      deletePopup,
      deleteRequestedOffer,
      object,
      allVideos,
    } = this.state;
    const { t } = this.props;

    if (loading) return <Loader />;

    return (
      <div className='customers-page orders'>
        {deletePopup && (
          <React.Fragment>
            <div
              className='delete-popup-background'
              onClick={this.handleDeletePopUp}
            ></div>
            <div className='delete-pop-up'>
              <h5>{t('Are you sure to remove this video')}?</h5>
              <div className='inner-pop'>
                <div className='inner-pop-text'>
                  <h2>
                    <span className='gray-span'>Video Name:</span>{' '}
                    {deleteRequestedOffer.name}
                  </h2>
                  {/* <h2>Offer: {deleteRequestedOffer.offerDetails}</h2> */}
                </div>
              </div>
              <button onClick={() => this.removeLocation(deleteRequestedOffer)}>
                {t('Yes')}
              </button>
              <button onClick={() => this.handleDeletePopUp('')}>
                {t('No')}
              </button>
            </div>
          </React.Fragment>
        )}

        <div className='profile-right-block' style={{ animationDelay: '0.1s' }}>
          <h1>{t('Videos')}</h1>
          <br />

          <div className='locations-page'>
            <div className='locations-page-2'>
              <div className='location-input-block'>
                {video && (
                  <div className='img-box'>
                    <div
                      className='remove-img-btn'
                      onClick={() => this.removeImage()}
                    >
                      X
                    </div>
                    <img src={video} alt='ALT' />
                  </div>
                )}

                {loaded > 0 && (
                  <div className='img-uploading-box'>
                    <div className='progress' style={{ width: '100%' }}>
                      <div
                        className='progress-bar bg-warning progress-bar-striped progress-bar-animated'
                        role='progressbar'
                        style={{ width: loaded + '%' }}
                        aria-valuenow={loaded}
                        aria-valuemin='0'
                        aria-valuemax='100'
                      >
                        {this.state.loaded > 0 && this.state.loaded + '%'}
                      </div>
                    </div>
                  </div>
                )}

                {!video && loaded === 0 && (
                  <label className='image-input-label'>
                    {/* + */}
                    <i className='far fa-file-video'></i>
                    <p>{t('Choose Video')}</p>
                    <input
                      type='file'
                      size='60'
                      onChange={this._handleImageChange}
                    />
                  </label>
                )}

                <Input
                  type='text'
                  name='name'
                  className='form-control location-input'
                  placeholder={t('Enter Video Name')}
                  value={object.name}
                  onChange={this.handleInput}
                  // onChange={(e) => this.handleInput(e.currentTarget.value)}
                  autoFocus
                />

                <Select
                  options={categories.filter((c) => c !== 'All')}
                  name='category'
                  value={object.category}
                  def={true}
                  // label='Choose Category'
                  onChange={this.handleChange}
                  // error={errors.category}
                />

                <div>
                  <button onClick={this.addVideo} disabled={this.isEmpty()}>
                    {t('Add Video')}
                  </button>
                  <span
                    onClick={() =>
                      this.setState({
                        video: '',
                        object: {
                          _id: '',
                          name: '',
                          category: '',
                          videoUrl: '',
                          views: '',
                          publishDate: '',
                        },
                      })
                    }
                    style={{
                      marginLeft: '10px',
                      cursor: 'pointer',
                    }}
                  >
                    {t('Clear')}
                  </span>
                </div>
              </div>
              <div className='linee'></div>
            </div>

            {/* <div className='locations'>
              {allVideos.map((l) => (
                <div className='location-box' key={l._id}>
                  <div>
                    <span>
                      <span className='light-text'>{t('Video Url')}: </span>
                      {l.videoUrl}
                    </span>
                    <span>
                      <span className='light-text'>{t('Name')}: </span>
                      {l.name}
                    </span>
                    <span>
                      <span className='light-text'>{t('Category')}: </span>
                      {l.category}
                    </span>
                    <span>
                      <span className='light-text'>{t('Views')}: </span>
                      {l.views}
                    </span>
                    <span>
                      <span className='light-text'>{t('Publish Date')}: </span>
                      {moment(l.publishDate).format('lll')}
                    </span>
                  </div>
                  <div>
                    <button
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
                    </button>
                  </div>
                </div>
              ))}
            </div> */}
          </div>
          <table className=' orders-table'>
            <thead>
              <tr>
                <th>Thumbnail</th>      
                <th className='hide-col'>Name</th>
                <th className='hide-col'>Category</th>
                <th className='hide-col'>Views</th>
                <th className='hide-col'>Publish Date</th>
                <th></th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {allVideos.map((o) => (
                <tr key={o._id}>
                  <td>
                    <div className='item-pic'>
                      <div className='video-table-thumb'>
                        <img
                          src={o.videoUrl}
                          alt='pic'
                          // style={{ marginRight: '7px' }}
                        />
                      </div>
                    </div>
                  </td>

                  <td className='hide-col'>{o.name}</td>
                  <td className='hide-col'>{o.category}</td>
                  <td className='hide-col'>{o.views}</td>
                  <td className='hide-col'>
                    {moment(o.publishDate).format('lll')}
                  </td>

                  <td>
                    <button
                      className='update-pro'
                      onClick={() => this.handleUpdatePopUp(o)}
                    >
                      Update
                    </button>
                  </td>
                  <td>
                    <button
                      className='delete-pro'
                      onClick={() => this.handleDeletePopUp(o)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default VideosPage;
