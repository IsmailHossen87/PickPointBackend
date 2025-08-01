import dotenv from "dotenv"
import { string } from "zod"
dotenv.config()

interface ENVconfig {
    Port: string,
    DB_URL: string,
    NODE_ENV: "development" | "production",
    JWT_ACCESS_SECRET: string,
    JWT_ACCESS_EXPIRES: string,
    // for refresh
    JWT_REFRESH_SECRET: string
    JWT_REFRESH_EXPIRES: string
    BCRYPT_SALT_ROUTD: string
    SUPER_ADMIN_EMAIL: string
    SUPER_ADMIN_PASSWORD: string
    GOOGLE_CLIENT_ID: string
    GOOGLE_CLIENT_SECRET: string
    GOOGLE_CALLBACK_URL: string
    Express_SESSION_SECRET: string
    FRONTEND_URL: string
    // Payment
    SSL: {
        SSL_STORE_ID: string
        SSL_STORE_PASS: string
        SSL_PAYMENT_API: string
        SSL_VALIDATION_API: string
        SSL_SUCESS_BACKEND_URL: string
        SSL_FAIL_BACKEND_URL: string
        SSL_CANCEL_BACKEND_URL: string
        SSL_SUCESS_FRONTEND_URL: string
        SSL_FAIL_FRONTEND_URL: string
        SSL_CANCEL_FRONTEND_URL: string
    }
    // Image 
    CLOUDINARY: {
        CLOUDINARY_CLOUD_NAME: string
        CLOUDINARY_API_KEY: string
        CLOUDINARY_SECRET: string
    }
}

const loadEnvVariable = (): ENVconfig => {
    const requireEnv: string[] = ["Port", "DB_URL", "NODE_ENV", "BCRYPT_SALT_ROUTD", "JWT_ACCESS_SECRET", "JWT_ACCESS_EXPIRES", "SUPER_ADMIN_PASSWORD", "SUPER_ADMIN_EMAIL", "JWT_REFRESH_SECRET", "JWT_REFRESH_EXPIRES", "GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET", "GOOGLE_CALLBACK_URL", "Express_SESSION_SECRET", "FRONTEND_URL", "SSL_SUCESS_BACKEND_URL", "SSL_FAIL_BACKEND_URL", "SSL_CANCEL_BACKEND_URL", "SSL_SUCESS_FRONTEND_URL", "SSL_FAIL_FRONTEND_URL", "SSL_CANCEL_FRONTEND_URL", "CLOUDINARY_CLOUD_NAME", "CLOUDINARY_API_KEY", "CLOUDINARY_SECRET"
    ];
    requireEnv.forEach(key => {
        if (!process.env[key]) {
            throw new Error(`Missing require environment variable ${key}`)
        }
    })
    return {
        Port: process.env.Port as string,
        DB_URL: process.env.DB_URL as string,
        NODE_ENV: process.env.NODE_ENV as "development" | "production",
        JWT_ACCESS_EXPIRES: process.env.JWT_ACCESS_EXPIRES as string,
        JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET as string,
        BCRYPT_SALT_ROUTD: process.env.BCRYPT_SALT_ROUTD as string,
        SUPER_ADMIN_EMAIL: process.env.SUPER_ADMIN_EMAIL as string,
        SUPER_ADMIN_PASSWORD: process.env.SUPER_ADMIN_PASSWORD as string,
        JWT_REFRESH_EXPIRES: process.env.JWT_REFRESH_EXPIRES as string,
        JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET as string,
        GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID as string,
        GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET as string,
        GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL as string,
        Express_SESSION_SECRET: process.env.Express_SESSION_SECRET as string,
        FRONTEND_URL: process.env.FRONTEND_URL as string,
        // Payment
        SSL: {
            SSL_STORE_ID: process.env.SSL_STORE_ID as string,
            SSL_STORE_PASS: process.env.SSL_STORE_PASS as string,
            SSL_PAYMENT_API: process.env.SSL_PAYMENT_API as string,
            SSL_VALIDATION_API: process.env.SSL_VALIDATION_API as string,

            SSL_SUCESS_BACKEND_URL: process.env.SSL_SUCESS_BACKEND_URL as string,
            SSL_FAIL_BACKEND_URL: process.env.SSL_FAIL_BACKEND_URL as string,
            SSL_CANCEL_BACKEND_URL: process.env.SSL_CANCEL_BACKEND_URL as string,

            SSL_SUCESS_FRONTEND_URL: process.env.SSL_SUCESS_FRONTEND_URL as string,
            SSL_FAIL_FRONTEND_URL: process.env.SSL_FAIL_FRONTEND_URL as string,
            SSL_CANCEL_FRONTEND_URL: process.env.SSL_CANCEL_FRONTEND_URL as string,
        },
        // image 
        CLOUDINARY: {
            CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME as string,
            CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY as string,
            CLOUDINARY_SECRET: process.env.CLOUDINARY_SECRET as string,
        }

    }
}


export const envVars = loadEnvVariable() 