import styles from './Topbar.module.css';

export default function Topbar() {
  return (
    <nav className={styles.container}>
      <img
        className={styles.logo}
        src="src/Components/Topbar/assets/manuwebLogo.png"
        alt=""
      />
      <div className={styles.menu}>
        <div className={styles.stripe} />
        <div className={styles.stripe} />
        <div className={styles.stripe} />
      </div>
    </nav>
  );
}
