// @ts-ignore
import React from '../public/react.development';
// @ts-ignore
import { createRoot } from '../public/react-dom.development';
import Router from './router';

const root = createRoot(document.getElementById('root'));
root.render(<Router />);

// createRoot (<Router />, document.getElementById('root'));
