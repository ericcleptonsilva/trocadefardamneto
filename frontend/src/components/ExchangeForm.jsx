import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ExchangeForm({ onExchangeRegistered }) {
  const [formData, setFormData] = useState({
    student_id: '',
    uniform_code: '',
    uniform_size: '',
    reason: ''
  });
  const [uniforms, setUniforms] = useState([]);
  const [codes, setCodes] = useState([]);
  const [sizes, setSizes] = useState([]);

  useEffect(() => {
    fetchUniforms();
  }, []);

  const fetchUniforms = async () => {
    try {
      const response = await axios.get('/api/uniforms.php');
      const data = response.data;
      setUniforms(data);

      const uniqueCodes = [...new Set(data.map(u => u.code))];
      const uniqueSizes = [...new Set(data.map(u => u.size))];

      setCodes(uniqueCodes);
      setSizes(uniqueSizes);
    } catch (error) {
      console.error("Error fetching uniforms:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/register_exchange.php', formData);
      alert('Troca registrada com sucesso!');
      setFormData({
        student_id: '',
        uniform_code: '',
        uniform_size: '',
        reason: ''
      });
      if (onExchangeRegistered) {
        onExchangeRegistered();
      }
    } catch (error) {
      console.error("Error registering exchange:", error);
      alert('Erro ao registrar troca.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="exchange-form">
      <div className="form-group">
        <label htmlFor="student_id">Matrícula do Aluno</label>
        <input
          type="text"
          id="student_id"
          name="student_id"
          value={formData.student_id}
          onChange={handleChange}
          placeholder="Digite a matrícula"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="uniform_code">Código do Fardamento</label>
        <input
          type="text"
          id="uniform_code"
          name="uniform_code"
          value={formData.uniform_code}
          onChange={handleChange}
          list="uniform_codes"
          placeholder="Selecione ou digite"
          required
        />
        <datalist id="uniform_codes">
          {codes.map(code => (
            <option key={code} value={code} />
          ))}
        </datalist>
      </div>

      <div className="form-group">
        <label htmlFor="uniform_size">Tamanho</label>
        <input
          type="text"
          id="uniform_size"
          name="uniform_size"
          value={formData.uniform_size}
          onChange={handleChange}
          list="uniform_sizes"
          placeholder="Selecione ou digite"
          required
        />
        <datalist id="uniform_sizes">
          {sizes.map(size => (
            <option key={size} value={size} />
          ))}
        </datalist>
      </div>

      <div className="form-group">
        <label htmlFor="reason">Motivo da Troca</label>
        <input
          type="text"
          id="reason"
          name="reason"
          value={formData.reason}
          onChange={handleChange}
          list="reasons_list"
          placeholder="Ex: Tamanho errado, Defeito..."
          required
        />
        <datalist id="reasons_list">
          <option value="Tamanho Incorreto" />
          <option value="Defeito de Fábrica" />
          <option value="Desgaste Natural" />
          <option value="Perda/Roubo" />
          <option value="Entrega Inicial" />
        </datalist>
      </div>

      <button type="submit">Registrar Troca</button>
    </form>
  );
}

export default ExchangeForm;
