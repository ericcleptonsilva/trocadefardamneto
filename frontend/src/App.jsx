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
  Maximize2
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
      const res = await api.get('/history')
      setHistory(res.data)
    } catch (err) {
      console.error('Error fetching history:', err)
    } finally {
      setLoading(false)
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
      <header>
        <h1><ArrowRightLeft size={32} color="#2563eb" /> Registro de Troca de Fardamento</h1>
        <p style={{ color: '#64748b', marginLeft: '40px' }}>Sistema de gerenciamento de fardamento escolar</p>
      </header>

      <div className="card">
        <h2 className="card-title"><ClipboardList size={20} /> Nova Troca</h2>
        <form onSubmit={handleRegister}>
          <div className="form-group" style={{ maxWidth: '400px' }}>
            <label><User size={14} style={{ marginRight: '5px' }} /> Matrícula do Aluno</label>
            <input
              type="text"
              placeholder="Digite a matrícula..."
              value={studentId}
              onChange={e => setStudentId(e.target.value)}
              required
            />
          </div>

          <div className="form-grid">
            <div className="form-section">
              <h3>Entrou (Devolução)</h3>
              <div className="form-group">
                <label><Package size={14} style={{ marginRight: '5px' }} /> Código</label>
                <input
                  type="text"
                  placeholder="Ex: POLO-01"
                  list="uniformCodes"
                  value={inCode}
                  onChange={e => setInCode(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label><Maximize2 size={14} style={{ marginRight: '5px' }} /> Tamanho</label>
                <input
                  type="text"
                  placeholder="Ex: M"
                  list="uniformSizes"
                  value={inSize}
                  onChange={e => setInSize(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-section">
              <h3>Saiu (Entrega)</h3>
              <div className="form-group">
                <label><Package size={14} style={{ marginRight: '5px' }} /> Código</label>
                <input
                  type="text"
                  placeholder="Ex: POLO-02"
                  list="uniformCodes"
                  value={outCode}
                  onChange={e => setOutCode(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label><Maximize2 size={14} style={{ marginRight: '5px' }} /> Tamanho</label>
                <input
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

          <button type="submit" className="btn-primary" style={{ marginTop: '2rem', width: '200px' }}>
            Registrar Troca
          </button>
        </form>
      </div>

      <div className="form-grid">
        <div className="card">
          <h2 className="card-title"><Upload size={20} /> Importar Catálogo</h2>
          <div className="form-group">
            <label>Selecione o arquivo CSV (code,size)</label>
            <input
              type="file"
              accept=".csv"
              onChange={e => setFile(e.target.files[0])}
              style={{ padding: '0.4rem' }}
            />
          </div>
          <button onClick={handleImport} className="btn-outline" style={{ width: '100%' }}>
            <Upload size={18} /> Importar agora
          </button>
        </div>

        <div className="card">
          <h2 className="card-title"><Download size={20} /> Exportar Relatórios</h2>
          <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
            Gere um arquivo PDF com todo o histórico de trocas registradas no sistema.
          </p>
          <button onClick={handleExportPDF} className="btn-success" style={{ width: '100%' }}>
            <Download size={18} /> Baixar Histórico (PDF)
          </button>
        </div>
      </div>

      <div className="card">
        <div className="actions-bar">
          <h2 className="card-title" style={{ marginBottom: 0 }}><RefreshCw size={20} /> Histórico de Trocas</h2>
          <button onClick={fetchHistory} className="btn-outline" disabled={loading}>
            <RefreshCw size={18} className={loading ? 'spin' : ''} />
            {loading ? 'Carregando...' : 'Atualizar Lista'}
          </button>
        </div>

        <table>
          <thead>
            <tr>
              <th>Matrícula</th>
              <th>Entrou (C/T)</th>
              <th>Saiu (C/T)</th>
              <th>Data e Hora</th>
            </tr>
          </thead>
          <tbody>
            {history.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                  Nenhum registro encontrado.
                </td>
              </tr>
            ) : (
              history.map(item => (
                <tr key={item.id}>
                  <td style={{ fontWeight: '600' }}>{item.student_id}</td>
                  <td>
                    <span className="badge badge-in">{item.in_uniform_code}</span>
                    <span style={{ margin: '0 5px', color: '#cbd5e1' }}>/</span>
                    <span style={{ fontWeight: '500' }}>{item.in_uniform_size}</span>
                  </td>
                  <td>
                    <span className="badge badge-out">{item.out_uniform_code}</span>
                    <span style={{ margin: '0 5px', color: '#cbd5e1' }}>/</span>
                    <span style={{ fontWeight: '500' }}>{item.out_uniform_size}</span>
                  </td>
                  <td style={{ color: '#64748b' }}>
                    {new Date(item.timestamp).toLocaleString('pt-BR')}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <style>{`
        .spin { animation: rotate 1s linear infinite; }
        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

export default App
