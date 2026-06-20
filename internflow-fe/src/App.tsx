import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Sidebar from './components/Sidebar';
import InternListPage from './components/InternListPage';
import MentorKanbanBoard from './components/MentorKanbanBoard';

function App() {
  return (
    <Router>
      <div className="flex min-h-screen bg-slate-50">
        <Sidebar userName="Mentor Admin" />
        <main className="ml-72 flex-1">
          <Routes>
            <Route path="/" element={<MentorKanbanBoard />} />
            <Route path="/overview" element={<MentorKanbanBoard />} />
            <Route path="/interns" element={<InternListPage />} />
            <Route
              path="/settings"
              element={
                <div className="min-h-screen bg-slate-100 px-6 pt-40 pb-10 text-slate-900">
                  <h1 className="text-3xl font-semibold text-slate-900">Cài đặt</h1>
                  <p className="mt-3 text-slate-600">Trang cài đặt đang cập nhật.</p>
                </div>
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
