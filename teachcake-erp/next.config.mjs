/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        PROJECT_ID: process.env.PROJECT_ID,
        API_KEY: process.env.API_KEY,
        DATABASE_ID: process.env.DATABASE_ID,
        TEACHER_COLLECTION_ID: process.env.TEACHER_COLLECTION_ID,
        PROGRAM_COLLECTION_ID: process.env.PROGRAM_COLLECTION_ID,
        RECORD_COLLECTION_ID: process.env.RECORD_COLLECTION_ID,
        NEXT_PUBLIC_BUCKET_ID: process.env.NEXT_PUBLIC_BUCKET_ID,
        NEXT_PUBLIC_ENDPOINT: process.env.NEXT_PUBLIC_ENDPOINT,
    },
};

export default nextConfig;
