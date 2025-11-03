import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AuthPage } from './pages/AuthPage';
import { Dashboard } from './pages/Dashboard';
import { ABTestingPage } from './pages/ABTestingPage';
import { SnapshotsPage } from './pages/SnapshotsPage';
import { UsagePage } from './pages/UsagePage';
import { Sidebar } from './components/Layout/Sidebar';

function AppContent() {
  const { user, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'testing':
        return <ABTestingPage />;
      case 'snapshots':
        return <SnapshotsPage />;
      case 'usage':
        return <UsagePage />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex">
      <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
      <div className="flex-1">{renderPage()}</div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
