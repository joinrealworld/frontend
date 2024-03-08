import { apiURLDomain } from "./src/constant/global";

/** @type {import('next').NextConfig} */

const nextConfig = {
    reactStrictMode: false,
    swcMinify: true,
    images: {
        domains: [
            'cdn.discordapp.com', 'discordapp.com', apiURLDomain
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
