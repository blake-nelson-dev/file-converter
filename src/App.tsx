import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Dashboard from './features/dashboard/pages/Dashboard'
import About from './features/about/pages/About'
import Header from './shared/components/Header'

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  )
}

export default App