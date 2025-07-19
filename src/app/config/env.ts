import dotenv from "dotenv"
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
}

const loadEnvVariable = (): ENVconfig => {
    const requireEnv: string[] = ["Port", "DB_URL", "NODE_ENV", "BCRYPT_SALT_ROUTD", "JWT_ACCESS_SECRET", "JWT_ACCESS_EXPIRES", "SUPER_ADMIN_PASSWORD", "SUPER_ADMIN_EMAIL", "JWT_REFRESH_SECRET", "JWT_REFRESH_EXPIRES", "GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET", "GOOGLE_CALLBACK_URL", "Express_SESSION_SECRET", "FRONTEND_URL"
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
        GOOGLE_CLIENT_ID  :process.env.GOOGLE_CLIENT_ID as string,
        GOOGLE_CLIENT_SECRET :process.env.GOOGLE_CLIENT_SECRET as string,
        GOOGLE_CALLBACK_URL :process.env.GOOGLE_CALLBACK_URL as string,
        Express_SESSION_SECRET :process.env.Express_SESSION_SECRET as string,
        FRONTEND_URL :process.env.FRONTEND_URL as string,
    }
}


export const envVars = loadEnvVariable() 