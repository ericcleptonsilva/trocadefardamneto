import React, { useState, useEffect } from 'react';
import axios from 'axios';

function HistoryList({ refreshTrigger }) {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetchHistory();
  }, [refreshTrigger]);

  const fetchHistory = async () => {
    try {
      const response = await axios.get('/api/history.php');
      setHistory(response.data);
    } catch (error) {
      console.error("Error fetching history:", error);
    }
  };

  return (
    <div className="history-list">
      <h2>Histórico</h2>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Matrícula</th>
              <th>Código</th>
              <th>Tamanho</th>
              <th>Motivo</th>
              <th>Data/Hora</th>
            </tr>
          </thead>
          <tbody>
            {history.map((item) => (
              <tr key={item.id}>
                <td>{item.student_id}</td>
                <td>{item.uniform_code}</td>
                <td>{item.uniform_size}</td>
                <td>{item.reason || '-'}</td>
                <td>{new Date(item.timestamp).toLocaleString('pt-BR')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default HistoryList;
