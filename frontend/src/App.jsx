import { useState, useEffect } from 'react'
import axios from 'axios'
import {
  Download,
  Upload,
  ClipboardList,
  RefreshCw,
  ArrowRightLeft,
  User,
  Package,
  Maximize2,
  LogIn,
  LogOut,
  History
} from 'lucide-react'
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
  const [loading, setLoading] = useState(false)

  const api = axios.create({
    baseURL: ''
  })

  useEffect(() => {
    fetchHistory()
    fetchUniforms()
  }, [])

  const fetchHistory = async () => {
    setLoading(true)
    try {
      const res = await api.get('/history.php')
      setHistory(res.data)
    } catch (err) {
      console.error('Erro ao buscar histórico:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchUniforms = async () => {
    try {
      const res = await api.get('/uniforms.php')
      setUniforms(res.data)
    } catch (err) {
      console.error('Erro ao buscar catálogo:', err)
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    try {
      const res = await api.post('/register_exchange.php', {
        student_id: studentId,
        in_uniform_code: inCode,
        in_uniform_size: inSize,
        out_uniform_code: outCode,
        out_uniform_size: outSize
      })
      alert(res.data.message)
      setStudentId('')
      setInCode('')
      setInSize('')
      setOutCode('')
      setOutSize('')
      fetchHistory()
    } catch (err) {
      console.error('Error Details:', err)
      if (err.response) {
        console.error('Response Data:', err.response.data)
        console.error('Response Status:', err.response.status)
      }
      const errorMsg = err.response?.data?.error || err.message || 'Erro inesperado ao registrar a troca.'
      alert(`Falha no Registro: ${errorMsg}`)
    }
  }

  const handleImport = async () => {
    if (!file) return alert('Por favor, selecione um arquivo CSV primeiro.')
    const formData = new FormData()
    formData.append('file', file)
    try {
      const res = await api.post('/import_uniforms.php', formData)
      alert(res.data.message)
      setFile(null)
      fetchUniforms()
    } catch (err) {
      console.error('Import Error:', err)
      const errorMsg = err.response?.data?.error || err.message || 'Erro ao importar arquivo.'
      alert(`Falha na Importação: ${errorMsg}`)
    }
  }

  const handleExportPDF = () => {
    window.location.href = '/export_pdf.php'
  }

  const uniqueCodes = [...new Set(uniforms.map(u => u.code))]
  const uniqueSizes = [...new Set(uniforms.map(u => u.size))]

  return (
    <div className="app-container">
      <header>
        <h1><ArrowRightLeft size={40} color="#3b82f6" /> TrocaFarda</h1>
        <p>Sistema Inteligente de Gestão de Fardamento</p>
      </header>

      <div className="card">
        <h2 className="card-title"><ClipboardList size={24} color="#3b82f6" /> Nova Solicitação de Troca</h2>
        <form onSubmit={handleRegister}>
          <div className="form-group" style={{ maxWidth: '300px' }}>
            <label><User size={16} /> Matrícula do Aluno</label>
            <input
              className="input-styled"
              type="text"
              placeholder="Ex: 2024001"
              value={studentId}
              onChange={e => setStudentId(e.target.value)}
              required
            />
          </div>

          <div className="form-grid" style={{ marginTop: '1.5rem' }}>
            <div className="section-box">
              <h3><LogOut size={16} color="#f59e0b" /> Devolução (Entrada)</h3>
              <div className="form-group">
                <label>Código do Fardamento</label>
                <input
                  className="input-styled"
                  type="text"
                  placeholder="Selecione ou digite..."
                  list="uniformCodes"
                  value={inCode}
                  onChange={e => setInCode(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Tamanho</label>
                <input
                  className="input-styled"
                  type="text"
                  placeholder="Ex: M"
                  list="uniformSizes"
                  value={inSize}
                  onChange={e => setInSize(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="section-box">
              <h3><LogIn size={16} color="#10b981" /> Entrega (Saída)</h3>
              <div className="form-group">
                <label>Código do Fardamento</label>
                <input
                  className="input-styled"
                  type="text"
                  placeholder="Selecione ou digite..."
                  list="uniformCodes"
                  value={outCode}
                  onChange={e => setOutCode(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Tamanho</label>
                <input
                  className="input-styled"
                  type="text"
                  placeholder="Ex: G"
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

          <button type="submit" className="btn btn-primary" style={{ marginTop: '2rem', height: '48px', width: '220px' }}>
            Finalizar Registro
          </button>
        </form>
      </div>

      <div className="form-grid">
        <div className="card">
          <h2 className="card-title"><Upload size={20} /> Atualizar Catálogo</h2>
          <div className="form-group">
            <label>Upload de arquivo CSV (colunas: code, size)</label>
            <input
              className="input-styled"
              type="file"
              accept=".csv"
              onChange={e => setFile(e.target.files[0])}
              style={{ padding: '0.5rem' }}
            />
          </div>
          <button onClick={handleImport} className="btn btn-outline" style={{ width: '100%' }}>
            <Upload size={18} /> Importar CSV
          </button>
        </div>

        <div className="card">
          <h2 className="card-title"><Download size={20} /> Relatórios PDF</h2>
          <p style={{ color: '#4b5563', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
            Gere um documento PDF consolidado com todo o histórico de transações.
          </p>
          <button onClick={handleExportPDF} className="btn btn-success" style={{ width: '100%' }}>
            <Download size={18} /> Baixar Relatório Completo
          </button>
        </div>
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 className="card-title" style={{ margin: 0 }}><History size={24} color="#3b82f6" /> Histórico Recente</h2>
          <button onClick={fetchHistory} className="btn btn-outline" disabled={loading}>
            <RefreshCw size={18} className={loading ? 'spin' : ''} />
            {loading ? 'Sincronizando...' : 'Sincronizar'}
          </button>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Estudante</th>
                <th>Devolvido (Entrada)</th>
                <th>Entregue (Saída)</th>
                <th>Data da Troca</th>
              </tr>
            </thead>
            <tbody>
              {history.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '4rem', color: '#9ca3af' }}>
                    Nenhuma troca registrada ainda.
                  </td>
                </tr>
              ) : (
                history.map(item => (
                  <tr key={item.id}>
                    <td style={{ fontWeight: '700', color: '#111827' }}>{item.student_id}</td>
                    <td>
                      <span className="badge badge-in">{item.in_uniform_code}</span>
                      <span style={{ margin: '0 0.5rem', color: '#d1d5db' }}>|</span>
                      <span style={{ fontWeight: '600' }}>{item.in_uniform_size}</span>
                    </td>
                    <td>
                      <span className="badge badge-out">{item.out_uniform_code}</span>
                      <span style={{ margin: '0 0.5rem', color: '#d1d5db' }}>|</span>
                      <span style={{ fontWeight: '600' }}>{item.out_uniform_size}</span>
                    </td>
                    <td style={{ color: '#6b7280', fontSize: '0.8125rem' }}>
                      {new Date(item.timestamp).toLocaleString('pt-BR')}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default App
