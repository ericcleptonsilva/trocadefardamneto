import { useState } from 'react';
import './App.css';
import ExchangeForm from './components/ExchangeForm';
import HistoryList from './components/HistoryList';
import Actions from './components/Actions';
import BottomNav from './components/BottomNav';

function App() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [activeTab, setActiveTab] = useState('register');

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className={`app-container view-${activeTab}`}>
      <h1>Troca de Fardamento</h1>

      <div className="content-area">
        <div className="pane pane-register">
          <ExchangeForm onExchangeRegistered={handleRefresh} />
        </div>

        <div className="pane pane-history">
          <Actions onImportComplete={handleRefresh} />
          <HistoryList refreshTrigger={refreshTrigger} />
        </div>
      </div>

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}

export default App;
