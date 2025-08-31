import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Register from './register/Register'
import Login from './register/Login'
import ResetPasswordRequest from './register/ResetPasswordRequest'
import ResetPasswordConfirm from './register/ResetPasswordConfirm'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    <Register />
    <Login />
    <ResetPasswordRequest />
    <ResetPasswordConfirm />
  </StrictMode>,
)
