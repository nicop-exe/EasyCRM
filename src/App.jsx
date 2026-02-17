import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import CustomerLoadPage from './pages/CustomerLoadPage';

function App() {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/customers/new" element={<CustomerLoadPage />} />

          <Route path="/customers" element={<div className="text-white p-4">Gestión de Clientes (Próximamente)</div>} />
          <Route path="/documents" element={<div className="text-white p-4">Gestión de Documentos (Próximamente)</div>} />
          <Route path="/settings" element={<div className="text-white p-4">Configuración (Próximamente)</div>} />
        </Routes>
      </Layout>
    </HashRouter>
  )
}

export default App
