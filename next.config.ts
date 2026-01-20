import type { NextConfig } from "next";

// Para GitHub Pages: si el repo es usuario.github.io, basePath debe ser vacío
// Si es usuario.github.io/repo-name, basePath debe ser /repo-name
const isProd = process.env.NODE_ENV === 'production';
const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1] || 'raton-perez-viz';
// Si el repo termina en .github.io, no usar basePath
const isUserPage = repoName.endsWith('.github.io');
const basePath = isProd && !isUserPage ? `/${repoName}` : '';
const assetPrefix = isProd && !isUserPage ? `/${repoName}` : '';

const nextConfig: NextConfig = {
  output: 'export',
  distDir: 'out',
  images: {
    unoptimized: true,
  },
  basePath: basePath,
  assetPrefix: assetPrefix,
  trailingSlash: true,
};

export default nextConfig;
