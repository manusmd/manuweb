import styles from './Topbar.module.css';
import { motion, useAnimation } from 'framer-motion';
import { useState } from 'react';
import Menu from '../Menu/Menu';

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

  const menuVariants = {
    opened: {
      y: 20,
      opacity: 1,
    },
    closed: {
      y: -500,
      opacity: 0,
    },
  };

  return (
    <>
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

      <motion.div
        initial={false}
        variants={menuVariants}
        animate={isMenu ? 'opened' : 'closed'}
        transition={{ type: 'spring', mass: 1.5 }}
      >
        <Menu />
      </motion.div>
    </>
  );
}
