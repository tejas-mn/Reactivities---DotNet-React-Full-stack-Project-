import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import mkcert from 'vite-plugin-mkcert'

// https://vite.dev/config/
export default defineConfig({
  server : {
    https: false //true in local env
  },
  plugins: [react(), mkcert()],
})
