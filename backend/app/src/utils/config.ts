import * as z from "zod";
require("dotenv").config();

enum EnvNames {
  NODE_ENV = "NODE_ENV",
  DATABASE_URL = "DATABASE_URL",
  JWT_ACCESS_SECRET = "JWT_ACCESS_SECRET",
  JWT_REFRESH_SECRET = "JWT_REFRESH_SECRET",
  JWT_ACCESS_LIFETIME = "JWT_ACCESS_LIFETIME",
  JWT_REFRESH_LIFETIME = "JWT_REFRESH_LIFETIME",
}

function getErrorMessage(environmentVariableName: EnvNames) {
  return {
    message: `Missing ${environmentVariableName} environment variable.`,
  };
}
export const configSchema = z.object({
  environment: z.string().min(1, getErrorMessage(EnvNames.NODE_ENV)),
  database_url: z.string().min(1, getErrorMessage(EnvNames.DATABASE_URL)),
  jwt_access_secret: z
    .string()
    .min(1, getErrorMessage(EnvNames.JWT_ACCESS_SECRET)),
  jwt_refresh_secret: z
    .string()
    .min(1, getErrorMessage(EnvNames.JWT_REFRESH_SECRET)),
  jwt_access_lifetime: z
    .string()
    .min(1, getErrorMessage(EnvNames.JWT_ACCESS_LIFETIME)),
  jwt_refresh_lifetime: z
    .string()
    .min(1, getErrorMessage(EnvNames.JWT_REFRESH_LIFETIME)),
  rest_port: z.number(),
  soap_port: z.number(),
  xml_rpc_port: z.number(),
});

export type Config = z.infer<typeof configSchema>;

const envConfig: Config = {
  environment: process.env.NODE_ENV || "",
  database_url: process.env.DATABASE_URL || "",
  jwt_access_secret: process.env.JWT_ACCESS_SECRET || "",
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET || "",
  jwt_access_lifetime: process.env.JWT_ACCESS_LIFETIME || "",
  jwt_refresh_lifetime: process.env.JWT_REFRESH_LIFETIME || "",
  rest_port: Number(process.env.REST_PORT),
  soap_port: Number(process.env.SOAP_PORT),
  xml_rpc_port: Number(process.env.XML_RPC_PORT),
};

export const config = configSchema.parse(envConfig);
