import { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ReportPage from './pages/ReportPage';
import DashboardPage from './pages/DashboardPage';
import AdminPage from './pages/AdminPage';
import AboutPage from './pages/AboutPage';
import MLAConnectPage from './pages/MLAConnectPage';
import RankingsPage from './pages/RankingsPage';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'home':       return <HomePage onNavigate={setCurrentPage} />;
      case 'report':     return <ReportPage onNavigate={setCurrentPage} />;
      case 'dashboard':  return <DashboardPage onNavigate={setCurrentPage} />;
      case 'admin':      return <AdminPage onNavigate={setCurrentPage} />;
      case 'about':      return <AboutPage onNavigate={setCurrentPage} />;
      case 'mla':        return <MLAConnectPage onNavigate={setCurrentPage} />;
      case 'rankings':   return <RankingsPage onNavigate={setCurrentPage} />;
      default:           return <HomePage onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar currentPage={currentPage} onNavigate={setCurrentPage} />
      <main style={{ flex: 1 }}>
        {renderPage()}
      </main>
      <Footer onNavigate={setCurrentPage} />
    </div>
  );
}
