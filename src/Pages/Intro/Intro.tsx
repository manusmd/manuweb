import Lottie from 'react-lottie';
import animationData from './lotties/logo_animation.json';
import styles from './Intro.module.css';

function Intro(): JSX.Element {
  const defaultOptions = {
    loop: false,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  return (
    <div className={styles.container}>
      <Lottie options={defaultOptions} />
    </div>
  );
}
