/** @type {import('next').NextConfig} */
import path from 'path';
const nextConfig = {
    webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
        config.resolve.alias["eccrypto"] = path.resolve("./node_modules/eccrypto-js");        
        return config;
     },
     distDir: 'build',
};

export default nextConfig;
