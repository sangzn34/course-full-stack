import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Self-contained server output for Docker (apps/web/.next/standalone)
  output: 'standalone',
  // Monorepo: trace from repo root so @coffee/shared (workspace symlink) and
  // shared deps under root node_modules get included in standalone output.
  outputFileTracingRoot: path.join(__dirname, '../..'),
  webpack: (config, { dev }) => {
    if (dev) {
      // Apply on BOTH server + client bundles. Skipping the server bundle
      // produces null data-locatorjs in SSR HTML and triggers React hydration
      // mismatch ("Server: null Client: ..."), after which Locator can't find
      // source info on the element.
      config.module.rules.unshift({
        test: /\.tsx$/,
        exclude: /node_modules/,
        use: [{ loader: '@locator/webpack-loader', options: { rootContext: __dirname } }],
        enforce: 'pre',
      });
    }
    // @locator/runtime imports `setStyleProperty` from solid-js/web. Default
    // `node` condition resolves to server.js which doesn't export it. Force
    // the browser bundle — locator is client-only so SSR isn't affected.
    config.resolve.alias = {
      ...config.resolve.alias,
      'solid-js/web$': 'solid-js/web/dist/web.js',
    };
    return config;
  },
  // In production behind Caddy, /api/* is reverse-proxied by Caddy directly to
  // the NestJS container — no Next.js rewrite needed (and useful to skip,
  // because rewrite would otherwise hairpin through the web server).
  async rewrites() {
    if (process.env.NODE_ENV === 'production') {
      return [];
    }
    return [
      {
        source: '/api/:path*',
        destination: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/:path*',
      },
    ];
  },
};

export default nextConfig;
