import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import ExperienceShell from './App';
import './styles.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ExperienceShell />
  </StrictMode>,
);
