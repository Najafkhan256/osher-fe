import { useState, useEffect, useRef } from 'react';

const AnimationApi = () => {
  let [appear, setAppear] = useState(false);
  const ref = useRef(null);

  const handleScroll = () => {
    if (ref.current) {
      var top = window.pageYOffset;

      var offSet;
      if (window.innerWidth < 450)
        offSet = ref.current.offsetTop - window.innerHeight + 320;
      else offSet = ref.current.offsetTop - window.innerHeight + 380;

        console.log(ref)

      if (top >= offSet) {
        //   console.log(true);

        setAppear(true);
        return true;
      } else {
        // console.log(false);
          setAppear(false);
          
        return false;
      }
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return { appear, ref };
};
export default AnimationApi;
