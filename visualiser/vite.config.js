
import { defineConfig } from 'vite';


//    base: command === 'build' ? '/' : '/',


export default defineConfig(({ command, mode }) => ({

    server: {
        port: 3003,
    },
    base: './',

    build: {
        outDir: '../public',
        emptyOutDir: true,
        assetsDir: 'assets',
    },

}));
