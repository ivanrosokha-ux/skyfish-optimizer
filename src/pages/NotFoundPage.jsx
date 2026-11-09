import { Link } from 'react-router-dom';
import styles from './NotFoundPage.module.css';

export default function NotFoundPage() {
  return (
    <div className={styles.container}>
      <div className={styles.fishIcon}>🎣🌊</div>
      <div className={styles.errorCode}>404</div>
      <h1 className={styles.title}>Нічого не спіймано! Сторінку загублено в морі</h1>
      <p className={styles.description}>
        Схоже, що вказаного маршруту не існує або вудка зачепилася за водорості. Перевірте
        правильність посилання або поверніться до огляду спорядження.
      </p>
      <Link to="/" className={styles.homeBtn}>
        <span>←</span> Повернутися на головну
      </Link>
    </div>
  );
}
