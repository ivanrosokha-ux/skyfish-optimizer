import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ProfilePage from './pages/ProfilePage';
import OptimizerPage from './pages/OptimizerPage';
import AccountPage from './pages/AccountPage';
import LoginPage from './pages/LoginPage';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col justify-between bg-background text-zinc-100">
        <div>
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<ProfilePage />} />
              <Route path="/optimizer" element={<OptimizerPage />} />
              <Route path="/account" element={<AccountPage />} />
              <Route path="/login" element={<LoginPage />} />
            </Routes>
          </main>
        </div>
        <Footer />
      </div>
    </Router>
  );
}
