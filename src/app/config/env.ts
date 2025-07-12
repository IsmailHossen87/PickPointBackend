import dotenv from "dotenv"

dotenv.config()

interface ENVconfig {
    Port: string,
    DB_URL: string,
    NODE_ENV: "development" | "production",
    JWT_ACCESS_SECRET:string,
    JWT_ACCESS_EXPIRES:string,
    BCRYPT_SALT_ROUTD:string
}

const loadEnvVariable = (): ENVconfig => {
    const requireEnv :string[]=["Port","DB_URL","NODE_ENV","BCRYPT_SALT_ROUTD","JWT_ACCESS_SECRET","JWT_ACCESS_EXPIRES"];
    requireEnv.forEach(key =>{
        if(!process.env[key]){
            throw new Error(`Missing require environment variable ${key}`)
        }
    })
    return {
        Port: process.env.Port as string,
        DB_URL: process.env.DB_URL as string,
        NODE_ENV: process.env.NODE_ENV as "development" | "production",
        JWT_ACCESS_EXPIRES: process.env.JWT_ACCESS_EXPIRES  as string,
        JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET  as string,
        BCRYPT_SALT_ROUTD: process.env.BCRYPT_SALT_ROUTD  as string,
    }
}


export const envVars = loadEnvVariable() 