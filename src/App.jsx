import { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ReportPage from './pages/ReportPage';
import DashboardPage from './pages/DashboardPage';
import AdminPage from './pages/AdminPage';
import AboutPage from './pages/AboutPage';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={setCurrentPage} />;
      case 'report':
        return <ReportPage onNavigate={setCurrentPage} />;
      case 'dashboard':
        return <DashboardPage onNavigate={setCurrentPage} />;
      case 'admin':
        return <AdminPage onNavigate={setCurrentPage} />;
      case 'about':
        return <AboutPage onNavigate={setCurrentPage} />;
      default:
        return <HomePage onNavigate={setCurrentPage} />;
    }
  };

  // Pages that show the page-header (dark header) instead of the hero
  const pageHasOwnHeader = ['report', 'admin', 'dashboard', 'about'].includes(currentPage);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar currentPage={currentPage} onNavigate={setCurrentPage} />
      
      {/* Spacer for pages that don't have their own top section */}
      {currentPage === 'home' || currentPage === 'about' ? null : null}
      
      <main style={{ flex: 1 }}>
        {renderPage()}
      </main>

      <Footer onNavigate={setCurrentPage} />
    </div>
  );
}
