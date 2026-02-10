import React, { useRef } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

function Actions({ onImportComplete }) {
  const fileInputRef = useRef(null);

  const handleImport = async () => {
    const file = fileInputRef.current.files[0];
    if (!file) {
      alert('Selecione um arquivo primeiro.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('/api/import_uniforms.php', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      alert(response.data.message);
      fileInputRef.current.value = '';
      if (onImportComplete) onImportComplete();
    } catch (error) {
      console.error("Error importing uniforms:", error);
      alert('Erro ao importar fardamentos.');
    }
  };

  const handleExportPDF = async () => {
    try {
      const response = await axios.get('/api/history.php');
      const history = response.data;

      const doc = new jsPDF();

      doc.setFontSize(16);
      doc.text("Histórico de Troca de Fardamento", 105, 10, { align: "center" });

      const tableColumn = ["Matrícula", "Código", "Tam.", "Motivo", "Data/Hora"];
      const tableRows = [];

      history.forEach(item => {
        const rowData = [
          item.student_id,
          item.uniform_code,
          item.uniform_size,
          item.reason || "",
          new Date(item.timestamp).toLocaleString('pt-BR')
        ];
        tableRows.push(rowData);
      });

      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 20,
      });

      doc.save("historico_fardamento.pdf");
    } catch (error) {
      console.error("Error exporting PDF:", error);
      alert("Erro ao exportar PDF.");
    }
  };

  return (
    <div className="actions">
      <h2>Ações</h2>
      <div className="form-group">
        <label htmlFor="importFile">Importar Fardamentos (CSV)</label>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <input
            type="file"
            id="importFile"
            accept=".csv"
            ref={fileInputRef}
            style={{ padding: '10px' }}
          />
          <button onClick={handleImport} style={{ width: 'auto' }}>Importar</button>
        </div>
      </div>
      <button onClick={handleExportPDF} className="secondary">Exportar Histórico (PDF)</button>
    </div>
  );
}

export default Actions;
