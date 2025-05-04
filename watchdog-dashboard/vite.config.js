import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
    ],
    server: {
        proxy: {
            '/socket.io': {
                target: 'http://5.75.237.233:3001',
                ws: true,
                changeOrigin: true,
                secure: false,
            },
            '/api': {
                target: 'http://5.75.237.233:3001',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, ''),
            },
        },
    },
})
