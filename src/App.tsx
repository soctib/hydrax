import { useEffect, useState } from 'react'
import './App.css'
import MainScreen from "./MainScreen";
import { SettingsScreen } from "./SettingsScreen";

export type TabType = 'main' | 'settings';

export default function App() {
  const getInitialTab = (): TabType => {
    const hash = window.location.hash.slice(1);
    return hash === 'settings' ? 'settings' : 'main';
  };
  const [activeTab, setActiveTab] = useState<TabType>(getInitialTab());

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (hash === 'settings') {
        setActiveTab('settings');
      } else {
        setActiveTab('main');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    window.location.hash = activeTab;
  }, [activeTab]);

  return (
    <div
      className="app-container"
      style={{ display: "flex", flexDirection: "column", height: "100vh" }}
    >
      <nav
        className="tab-navigation padding-b-md"
        style={{ display: "flex", width: "100vw", maxWidth: "100vw", position: "sticky", top: 0, zIndex: 1 }}
      >
        <div
          className="tab-buttons-container padding-x-xl margin-x-auto"
          style={{ display: "flex", width: "100%" }}
        >
          <button
            className={`tab-button padding-lg padding-x-xl${activeTab === 'main' ? ' active' : ''}`}
            onClick={() => setActiveTab('main')}
          >
            Chat
          </button>
          <button
            className={`tab-button padding-lg padding-x-xl${activeTab === 'settings' ? ' active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            Settings
          </button>
        </div>
      </nav>
      <div
        className="tab-content padding-y-xl"
        style={{ flex: 1, overflowY: "auto", width: "100vw", maxWidth: "100vw" }}
      >
        <div className="content-container padding-x-xl margin-x-auto">
          {activeTab === 'main' && <MainScreen />}
          {activeTab === 'settings' && <SettingsScreen />}
        </div>
      </div>
    </div>
  )
}
