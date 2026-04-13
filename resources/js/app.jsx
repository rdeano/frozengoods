import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { createRoot } from 'react-dom/client';
import theme from './theme';
import { CartProvider } from './Contexts/CartContext';

createInertiaApp({
    title: (title) => `${title} - Frozen Goods`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <CartProvider>
                    <App {...props} />
                </CartProvider>
            </ThemeProvider>
        );
    },
    progress: {
        color: '#0B3D91',
    },
});
