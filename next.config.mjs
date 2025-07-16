/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: "shnnyqavmcltfpmprzll.supabase.co"
            }
        ]
    }
};

export default nextConfig;
