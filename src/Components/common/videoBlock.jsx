import React, { useState } from 'react';
// import ReactPlayer from 'react-player';

const VideoBlock = ({ sec, video, isLoaded }) => {
  const [videoReady, setVideoReady] = useState(false);
  // const url =
  //   'https://firebasestorage.googleapis.com/v0/b/beverix.appspot.com/o/images%2Ffile_example_MP4_640_3MG.mp4?alt=media&token=d1ccfbc7-3bdb-4836-9e2d-6818669e593d';
  return (
    <div className='videoads'>
      <div className='video-heading-block'>
        <h1>
          {videoReady
            ? `This screen will disappear in ${sec} seconds.`
            : 'Video is getting ready'}
        </h1>
      </div>
      {/* <ReactPlayer
        playing={true}
        url={url}
        width='100%'
        height='100%'
      /> */}
      {/* <img src={video && video.videoUrl} width='100%' height='100%' alt=""/> */}
      <video
        width='100%'
        height='100%'
        autoPlay={true}
        onPlay={
          // console.log("playing")
          () => {
            setVideoReady(true);
            isLoaded();
          }
          // () => alert('playing')
        }
      >
        <source src={video && video.videoUrl} type='video/mp4' />
      </video>
      {/* <ReactPlayer url='https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4' /> */}
    </div>
  );
};

export default VideoBlock;
