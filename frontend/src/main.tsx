import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'
import App from './App'
import Register from './register/Register'
import Login from './register/Login'
import Logout from './register/Logout'
import ResetPasswordRequest from './register/ResetPasswordRequest'
import ResetPasswordConfirm from './register/ResetPasswordConfirm'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    <Register />
    <Login />
    <Logout />
    <ResetPasswordRequest />
    <ResetPasswordConfirm />
  </StrictMode>,
)
