import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/History.css'
import './styles/Home.css'
import './styles/Modal.css'
import './styles/PhotoGrid.css'
import './styles/global.css'
import { router } from './routes/Routes.tsx'
import { RouterProvider } from 'react-router-dom'
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />;
  </StrictMode>,
)
