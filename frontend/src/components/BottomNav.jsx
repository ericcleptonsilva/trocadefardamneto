import React from 'react';
import './BottomNav.css';

function BottomNav({ activeTab, onTabChange }) {
  return (
    <div className="bottom-nav">
      <button
        className={`nav-button ${activeTab === 'register' ? 'active' : ''}`}
        onClick={() => onTabChange('register')}
      >
        Registrar
      </button>
      <button
        className={`nav-button ${activeTab === 'history' ? 'active' : ''}`}
        onClick={() => onTabChange('history')}
      >
        Histórico
      </button>
    </div>
  );
}

export default BottomNav;
