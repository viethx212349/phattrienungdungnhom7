import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

function App() {
  return (
    <Router>
      <div className="flex h-screen bg-gray-50">
        {/* Placeholder cho Sidebar và Header (components/layout) */}
        <div className="flex-1 flex flex-col">
          <main className="flex-1 p-6">
            <Routes>
              {/* Routing cho các modules (features/interns, features/tasks) sẽ nằm ở đây */}
              <Route path="/" element={<div>InternFlow Workspace Initialized</div>} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
