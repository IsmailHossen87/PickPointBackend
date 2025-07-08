import dotenv from "dotenv"

dotenv.config()

interface ENVconfig {
    Port: string,
    DB_URL: string,
    NODE_ENV: "development" | "production"
}

const loadEnvVariable = (): ENVconfig => {
    const requireEnv :string[]=["Port","DB_URL","NODE_ENV"];
    requireEnv.forEach(key =>{
        if(!process.env[key]){
            throw new Error(`Missing require environment variable ${key}`)
        }
    })
    return {
        Port: process.env.Port as string,
        DB_URL: process.env.DB_URL as string,
        NODE_ENV: process.env.NODE_ENV as "development" | "production",
    }
}


export const envVars = loadEnvVariable() 