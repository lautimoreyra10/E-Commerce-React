import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
/* import { Auth0Provider } from '@auth0/auth0-react' */
import './styles/index.css'
import App from './App.tsx'
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';
import './utils/i18n.ts';
import { LanguageProvider } from "./components/LanguageContext"; // Importa tu LanguageProvider
// Agrega los íconos necesarios a la librería
library.add(faCartShopping);
/* const domain = import.meta.env.VITE_AUTH0_DOMAIN || "";
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID || "";
 */
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LanguageProvider>
{/*     <Auth0Provider
    domain={domain}
    clientId={clientId}
    authorizationParams={{
      redirect_uri: window.location.origin
    }}
    > */}
    <App />
    </LanguageProvider>
{/*     </Auth0Provider>, */}
  </StrictMode>,
)
