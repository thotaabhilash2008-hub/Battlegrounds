import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import GamesPage from './pages/GamesPage'
import RegisterPage from './pages/RegisterPage'
import PaymentPage from './pages/PaymentPage'
import AdminPage from './pages/AdminPage'
import TicketPage from './pages/TicketPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/games" element={<GamesPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/payment" element={<PaymentPage />} />
      <Route path="/ticket" element={<TicketPage />} />
      <Route path="/admin" element={<AdminPage />} />
    </Routes>
  )
}
