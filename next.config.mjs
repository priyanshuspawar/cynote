/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: "aosbhowyndetvgiikftl.supabase.co"
            }
        ]
    }
};

export default nextConfig;
