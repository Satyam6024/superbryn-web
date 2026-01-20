import { Routes, Route } from 'react-router-dom';
import { ConversationProvider } from './context/ConversationContext';
import HomePage from './pages/HomePage';
import ConversationPage from './pages/ConversationPage';
import HistoryPage from './pages/HistoryPage';
import AdminPage from './pages/AdminPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <ConversationProvider>
      <div className="min-h-screen bg-dark-bg">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/conversation" element={<ConversationPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </ConversationProvider>
  );
}

export default App;
