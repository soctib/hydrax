import { useEffect, useState } from 'react'
import './App.css'
import MainScreen from "./MainScreen";
import { SettingsScreen } from "./SettingsScreen";

export type TabType = 'main' | 'settings';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('main');

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (hash === 'settings') {
        setActiveTab('settings');
      } else {
        setActiveTab('main');
      }
    };
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    window.location.hash = activeTab;
  }, [activeTab]);

  return (
    <div className="app-container">
      <nav className="tab-navigation">
        <div className="tab-buttons-container">
          <button
            className={`tab-button ${activeTab === 'main' ? 'active' : ''}`}
            onClick={() => setActiveTab('main')}
          >
            Chat
          </button>
          <button
            className={`tab-button ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            Settings
          </button>
        </div>
      </nav>
      <div className="tab-content">
        <div className="content-container">
          {activeTab === 'main' && <MainScreen />}
          {activeTab === 'settings' && <SettingsScreen />}
        </div>
      </div>
    </div>
  )
}
