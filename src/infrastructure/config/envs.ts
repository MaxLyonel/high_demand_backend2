import 'dotenv/config'
import * as joi from 'joi'


interface EnvVars {
  PORT: number
  HIGH_DEMAND_DB_NAME: string
  HIGH_DEMAND_DB_HOST: string
  HIGH_DEMAND_DB_PORT: number
  HIGH_DEMAND_DB_USERNAME: string
  HIGH_DEMAND_DB_PASSWORD: string
  JWT_SECRET: string
  JWT_EXPIRES_IN: string
  SEGIP_URL: string
  MODE: string
}

const envsSchema = joi
  .object({
    PORT: joi.number().required(),
    HIGH_DEMAND_DB_NAME: joi.string().required(),
    HIGH_DEMAND_DB_HOST: joi.string().required(),
    HIGH_DEMAND_DB_PORT: joi.number().required(),
    HIGH_DEMAND_DB_USERNAME: joi.string().required(),
    HIGH_DEMAND_DB_PASSWORD: joi.string().required(),
    JWT_SECRET: joi.string().required(),
    JWT_EXPIRES_IN: joi.string().required(),
    SEGIP_URL: joi.string().required(),
    MODE: joi.string()
  })
  .unknown(true)

const { error, value } = envsSchema.validate({
  ...process.env,
})

if(error) {
  throw new Error(`Config validation error: ${error.message}`)
}

const envVars: EnvVars = value

export const DbEnvs = {
  dbName: envVars.HIGH_DEMAND_DB_NAME,
  dbHost: envVars.HIGH_DEMAND_DB_HOST,
  dbPort: envVars.HIGH_DEMAND_DB_PORT,
  dbUser: envVars.HIGH_DEMAND_DB_USERNAME,
  dbPass: envVars.HIGH_DEMAND_DB_PASSWORD
}

export const envs = {
  jwtSecret: envVars.JWT_SECRET,
  expiresIn: envVars.JWT_EXPIRES_IN || '1h',
  mode: envVars.MODE
}

export const ownPort = {
  port: envVars.PORT
}

export const segip = {
  segipUrl: envVars.SEGIP_URL
}