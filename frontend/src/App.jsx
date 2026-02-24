import { useState, useEffect } from 'react'
import axios from 'axios'
import { Download, Upload, ClipboardList, RefreshCw } from 'lucide-react'
import './App.css'

function App() {
  const [history, setHistory] = useState([])
  const [uniforms, setUniforms] = useState([])
  const [studentId, setStudentId] = useState('')
  const [inCode, setInCode] = useState('')
  const [inSize, setInSize] = useState('')
  const [outCode, setOutCode] = useState('')
  const [outSize, setOutSize] = useState('')
  const [file, setFile] = useState(null)

  const api = axios.create({
    baseURL: '' // Proxy handles this
  })

  useEffect(() => {
    fetchHistory()
    fetchUniforms()
  }, [])

  const fetchHistory = async () => {
    try {
      const res = await api.get('/history')
      setHistory(res.data)
    } catch (err) {
      console.error('Error fetching history:', err)
    }
  }

  const fetchUniforms = async () => {
    try {
      const res = await api.get('/uniforms')
      setUniforms(res.data)
    } catch (err) {
      console.error('Error fetching uniforms:', err)
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    try {
      await api.post('/register_exchange', {
        student_id: studentId,
        in_uniform_code: inCode,
        in_uniform_size: inSize,
        out_uniform_code: outCode,
        out_uniform_size: outSize
      })
      alert('Troca registrada com sucesso!')
      setStudentId('')
      setInCode('')
      setInSize('')
      setOutCode('')
      setOutSize('')
      fetchHistory()
    } catch (err) {
      alert('Erro ao registrar troca.')
    }
  }

  const handleImport = async () => {
    if (!file) return alert('Selecione um arquivo primeiro.')
    const formData = new FormData()
    formData.append('file', file)
    try {
      const res = await api.post('/import_uniforms', formData)
      alert(res.data.message)
      setFile(null)
      fetchUniforms()
    } catch (err) {
      alert('Erro ao importar fardamentos.')
    }
  }

  const handleExportPDF = () => {
    window.location.href = '/export_pdf'
  }

  const uniqueCodes = [...new Set(uniforms.map(u => u.code))]
  const uniqueSizes = [...new Set(uniforms.map(u => u.size))]

  return (
    <div className="container">
      <h1><ClipboardList style={{ marginRight: '10px' }} /> Registro de Troca de Fardamento</h1>

      <div className="card">
        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label>Matrícula do Aluno</label>
            <input
              type="text"
              value={studentId}
              onChange={e => setStudentId(e.target.value)}
              required
            />
          </div>

          <div className="flex-row">
            <div className="flex-item">
              <h3>Fardamento que ENTROU</h3>
              <div className="form-group">
                <label>Código</label>
                <input
                  type="text"
                  list="uniformCodes"
                  value={inCode}
                  onChange={e => setInCode(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Tamanho</label>
                <input
                  type="text"
                  list="uniformSizes"
                  value={inSize}
                  onChange={e => setInSize(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="flex-item">
              <h3>Fardamento que SAIU</h3>
              <div className="form-group">
                <label>Código</label>
                <input
                  type="text"
                  list="uniformCodes"
                  value={outCode}
                  onChange={e => setOutCode(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Tamanho</label>
                <input
                  type="text"
                  list="uniformSizes"
                  value={outSize}
                  onChange={e => setOutSize(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          <datalist id="uniformCodes">
            {uniqueCodes.map(code => <option key={code} value={code} />)}
          </datalist>
          <datalist id="uniformSizes">
            {uniqueSizes.map(size => <option key={size} value={size} />)}
          </datalist>

          <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
            Registrar Troca
          </button>
        </form>
      </div>

      <div className="card actions-panel">
        <h2>Ações</h2>
        <div className="form-group">
          <label>Importar Fardamentos (CSV: code,size)</label>
          <div className="flex-row" style={{ alignItems: 'center' }}>
            <input
              type="file"
              accept=".csv"
              onChange={e => setFile(e.target.files[0])}
            />
            <button onClick={handleImport} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Upload size={18} /> Importar
            </button>
          </div>
        </div>
        <button onClick={handleExportPDF} className="btn-success" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
          <Download size={18} /> Exportar Histórico em PDF
        </button>
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2>Histórico de Trocas</h2>
          <button onClick={fetchHistory} style={{ background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <RefreshCw size={18} /> Atualizar
          </button>
        </div>
        <table>
          <thead>
            <tr>
              <th>Matrícula</th>
              <th>Entrou (C/T)</th>
              <th>Saiu (C/T)</th>
              <th>Data/Hora</th>
            </tr>
          </thead>
          <tbody>
            {history.map(item => (
              <tr key={item.id}>
                <td>{item.student_id}</td>
                <td>{item.in_uniform_code} / {item.in_uniform_size}</td>
                <td>{item.out_uniform_code} / {item.out_uniform_size}</td>
                <td>{new Date(item.timestamp).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default App
