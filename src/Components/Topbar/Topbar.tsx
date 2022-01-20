import styles from './Topbar.module.css';

export default function Topbar() {
  return (
    <div className={styles.container}>
      <img
        className={styles.logo}
        src="src/Components/Topbar/assets/manuwebLogo.png"
        alt="logo"
      />
    </div>
  );
}
