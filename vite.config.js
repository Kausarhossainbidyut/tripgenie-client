import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            // Proxy all /api requests to the live backend during local dev
            // This eliminates CORS entirely for localhost — the browser sees
            // requests going to localhost:5173/api, not the Vercel domain
            '/api': {
                target: 'https://tripgenie-backend.vercel.app',
                changeOrigin: true,
                secure: true,
            },
        },
    },
});
