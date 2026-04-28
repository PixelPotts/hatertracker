import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import SubjectsList from './components/SubjectsList';
import SubjectDetail from './components/SubjectDetail';
import IncidentsList from './components/IncidentsList';
import Analytics from './components/Analytics';
import Mitigations from './components/Mitigations';

function App() {
  const [activeView, setActiveView] = useState('dashboard');
  const [selectedHater, setSelectedHater] = useState(null);

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard setActiveView={setActiveView} setSelectedHater={setSelectedHater} />;
      case 'subjects':
        return <SubjectsList setActiveView={setActiveView} setSelectedHater={setSelectedHater} />;
      case 'detail':
        return <SubjectDetail haterId={selectedHater} setActiveView={setActiveView} />;
      case 'incidents':
        return <IncidentsList />;
      case 'analytics':
        return <Analytics />;
      case 'mitigations':
        return <Mitigations />;
      default:
        return <Dashboard setActiveView={setActiveView} setSelectedHater={setSelectedHater} />;
    }
  };

  return (
    <div className="app-layout">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      <main className="main-content">
        {renderView()}
      </main>
    </div>
  );
}

export default App;
