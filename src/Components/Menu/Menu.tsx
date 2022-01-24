import styles from './Menu.module.css';

export default function Menu(): JSX.Element {
  return (
    <div className={styles.container}>
      <div className={styles.nav}>
        <a href="#" className={styles.navlink}>
          About Me
        </a>
        <a href="#" className={styles.navlink}>
          Projects
        </a>
        <a href="#" className={styles.navlink}>
          Connect
        </a>
      </div>
    </div>
  );
}
