import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import FormTemplatesLibrary from './pages/FormTemplatesLibrary';
import FormCanvasBuilder from './pages/FormCanvasBuilder';
import FormSubmissionsView from './pages/FormSubmissionsView';
import { fetchFormStats } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('builder');
  const [stats, setStats] = useState({
    totalForms: 4,
    publishedForms: 4,
    totalSubmissions: 2850,
    averageCompletionRatePct: 89.4
  });

  useEffect(() => {
    fetchFormStats().then(data => {
      if (data) setStats(data);
    });
  }, []);

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans antialiased">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar stats={stats} />
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          {activeTab === 'library' && <FormTemplatesLibrary onSelectForm={() => setActiveTab('builder')} />}
          {activeTab === 'builder' && <FormCanvasBuilder />}
          {activeTab === 'submissions' && <FormSubmissionsView />}
        </main>
      </div>
    </div>
  );
}
