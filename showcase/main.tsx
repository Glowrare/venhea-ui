import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '../src/styles.css';
import './showcase.css';
import { Showcase } from './Showcase';

const root = document.getElementById('root');
if (!root) throw new Error('The showcase root element is missing.');

createRoot(root).render(<StrictMode><Showcase /></StrictMode>);
