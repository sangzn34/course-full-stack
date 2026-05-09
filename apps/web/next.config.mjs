import path from 'node:path';
import { fileURLToPath } from 'node:url';
import MillionLint from '@million/lint';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Self-contained server output for Docker (apps/web/.next/standalone)
  output: 'standalone',
  experimental: {
    // Monorepo: trace from repo root so @coffee/shared (workspace symlink)
    // and shared deps under root node_modules get included in standalone output.
    // Note: top-level in Next 15+, must be under `experimental` on Next 14.
    outputFileTracingRoot: path.join(__dirname, '../..'),
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

export default MillionLint.next({ rsc: true })(nextConfig);
