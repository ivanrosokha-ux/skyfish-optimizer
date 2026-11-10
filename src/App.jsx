import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ScrollToTop from './components/common/ScrollToTop';
import ProfilePage from './pages/ProfilePage';
import OptimizerPage from './pages/OptimizerPage';
import AccountPage from './pages/AccountPage';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';
import styles from './App.module.css';

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className={styles.appContainer}>
        <div>
          <Navbar />
          <main className={styles.mainContent}>
            <Routes>
              {/* Головна сторінка та динамічний маршрут профілю */}
              <Route path="/" element={<ProfilePage />} />
              <Route path="/profile/:player" element={<ProfilePage />} />

              {/* Сторінки оптимізатора спорядження, кабінету та авторизації */}
              <Route path="/optimizer" element={<OptimizerPage />} />
              <Route path="/account" element={<AccountPage />} />
              <Route path="/login" element={<LoginPage />} />

              {/* Сторінка помилки 404 для неіснуючих маршрутів */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
        </div>
        <Footer />
      </div>
    </Router>
  );
}
