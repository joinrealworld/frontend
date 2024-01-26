/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    images: {
        domains: [
            'cdn.discordapp.com', 'discordapp.com'
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
