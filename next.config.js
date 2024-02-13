/** @type {import('next').NextConfig} */
const nextConfig = {
    async headers(){
        return [
            {
                source: '/pools',
                headers: [
                  {
                    key: 'x-header',
                    value: 'authorized',
                  },
                  {
                    key: 'X-DNS-Prefetch-Control',
                    value: 'on'
                  },
                  {
                    key: 'X-Frame-Options',
                    value: 'SAMEORIGIN'
                  }
                ],
            }
        ]
    },
    images: {
      dangerouslyAllowSVG: true,
      contentDispositionType: 'attachment',
      contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    },
    webpack(config) {
      // Grab the existing rule that handles SVG imports
      const fileLoaderRule = config.module.rules.find((rule) =>
        rule.test?.test?.('.svg'),
      )
  
      config.module.rules.push(
        // Reapply the existing rule, but only for svg imports ending in ?url
        {
          ...fileLoaderRule,
          test: /\.svg$/i,
          resourceQuery: /url/, // *.svg?url
        },
        // Convert all other *.svg imports to React components
        {
          test: /\.svg$/i,
          issuer: fileLoaderRule.issuer,
          resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] }, // exclude if *.svg?url
          use: ['@svgr/webpack'],
        },
      )
  
      // Modify the file loader rule to ignore *.svg, since we have it handled now.
      fileLoaderRule.exclude = /\.svg$/i
  
      return config
    },
    experimental: {
      serverActions: {
        allowedOrigins: ['*.forge.trade', 'api.evmos.domains'],
      },
    },
}

module.exports = nextConfig
