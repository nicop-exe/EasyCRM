import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import CustomerLoadPage from './pages/CustomerLoadPage';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/customers/new" element={<CustomerLoadPage />} />
          {/* Add other routes as needed */}
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App
