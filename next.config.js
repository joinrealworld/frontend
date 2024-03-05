/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    swcMinify: true,
    images: {
        domains: [
            'cdn.discordapp.com', 'discordapp.com', '13.59.98.200'
        ],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '*.discordapp.com', // 'discordapp.com',
                port: '',
                pathname: '**',
            },
        ],
    },
    typescript: {
        ignoreBuildErrors: true,
    }
}

module.exports = nextConfig
