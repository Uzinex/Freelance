import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Register from './register/Register'
import Login from './register/Login'
import ResetPasswordRequest from './register/ResetPasswordRequest'
import ResetPasswordConfirm from './register/ResetPasswordConfirm'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<div>Главная</div>} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/reset-password" element={<ResetPasswordRequest />} />
        <Route path="/reset-password/confirm" element={<ResetPasswordConfirm />} />
      </Routes>
    </BrowserRouter>
  )
export default function App() {
  return null;
}
