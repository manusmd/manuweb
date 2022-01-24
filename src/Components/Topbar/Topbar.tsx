import styles from './Topbar.module.css';
import { motion, useAnimation } from 'framer-motion';
import { useState } from 'react';

export default function Topbar() {
  const [isMenu, setIsMenu] = useState(false);
  const top = useAnimation();
  const middle = useAnimation();
  const bottom = useAnimation();

  const topVariants = {
    opened: {
      y: 10,
      rotateZ: 130,
      backgroundColor: 'purple',
    },
    closed: {
      y: 0,
      rotateZ: 0,
      backgroundColor: 'white',
    },
  };
  const middleVariants = {
    opened: {
      rotate: 360,
      opacity: 0,
    },
    closed: {
      opacity: 1,
    },
  };
  const bottomVariants = {
    opened: {
      y: -10,
      rotateZ: -130,
    },
    closed: {
      y: 0,
      rotateZ: 0,
    },
  };

  return (
    <nav className={styles.container}>
      <img
        className={styles.logo}
        src="src/Components/Topbar/assets/manuwebLogo.png"
        alt=""
      />
      <div className={styles.menu} onClick={() => setIsMenu(!isMenu)}>
        <motion.div
          initial={false}
          variants={topVariants}
          animate={isMenu ? 'opened' : 'closed'}
          className={styles.stripe}
        />
        <motion.div
          initial={false}
          variants={middleVariants}
          animate={isMenu ? 'opened' : 'closed'}
          className={styles.stripe}
        />
        <motion.div
          initial={false}
          variants={bottomVariants}
          animate={isMenu ? 'opened' : 'closed'}
          className={styles.stripe}
        />
      </div>
    </nav>
  );
}
