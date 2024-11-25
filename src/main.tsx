import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Auth0Provider } from '@auth0/auth0-react'
import './styles/index.css'
import App from './App.tsx'

const domain ="dev-5hajz1mqnju72szn.us.auth0.com";
const clientId ="qD3P4nYfGFm7q0a3FQulhmjkAKkIPtom";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Auth0Provider
    domain={domain}
    clientId={clientId}
    authorizationParams={{
      redirect_uri: window.location.origin
    }}
    >
    <App />
    </Auth0Provider>,
  </StrictMode>,
)
