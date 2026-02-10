import { useState } from 'react';
import './App.css';
import ExchangeForm from './components/ExchangeForm';
import HistoryList from './components/HistoryList';
import Actions from './components/Actions';

function App() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="container">
      <h1>Troca de Fardamento</h1>
      <ExchangeForm onExchangeRegistered={handleRefresh} />
      <Actions onImportComplete={handleRefresh} />
      <HistoryList refreshTrigger={refreshTrigger} />
    </div>
  );
}

export default App;
