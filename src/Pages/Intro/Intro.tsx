import { useState } from 'react';
import Lottie from 'react-lottie';
import animationData from '../../lotties/logo_animation.json';
import styles from './Intro.module.css';

export default function Intro(): JSX.Element {
  const [isReady, setIsReady] = useState(false);

  const defaultOptions = {
    loop: false,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  setTimeout(() => {
    setIsReady(true);
  }, 4000);

  if (!isReady) {
    return (
      <>
        <div className={styles.container}>
          <Lottie options={defaultOptions} />
        </div>
      </>
    );
  }
  return (
    <>
      <h1 style={{ color: 'white' }}>Hallo!</h1>
    </>
  );
}
