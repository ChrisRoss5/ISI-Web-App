import api from "api/rest";
import soapService from "api/soap/soapService";
import getCurrentTemperature from "api/xml-rpc/getCurrentTemperature";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import fs from "fs";
import helmet from "helmet";
import * as middlewares from "middlewares";
import morgan from "morgan";
import * as soap from "soap";
import { config } from "utils/config";
import log from "utils/logger";
import xmlrpc from "xmlrpc";

// Tasks 1, 2, 4, 5, 6
const restApp = express();
restApp.use(morgan("dev"));
restApp.use(helmet());
restApp.use(cors());
restApp.use(express.json());
restApp.use(cookieParser());
restApp.use(middlewares.deserializeUser);
restApp.use("/api/rest", api);
restApp.use(middlewares.notFound);
restApp.use(middlewares.errorHandler);
restApp.listen(config.rest_port, () => {
  const url = `http://localhost:${config.rest_port}/api/rest`;
  log(`REST listening: ${url}`, __filename);
});

// Task 3
const soapApp = express();
const soapXml = fs.readFileSync("src/api/soap/search.wsdl", "utf8");
soap.listen(soapApp, "/api/soap", soapService, soapXml, () => {
  const url = `http://localhost:${config.soap_port}/api/soap`;
  log(`SOAP listening: ${url}`, __filename);
});
soapApp.use(cors());
soapApp.listen(config.soap_port);

// Task 5
const xmlRpcServer = xmlrpc.createServer({ port: config.xml_rpc_port }, () => {
  log(`XML-RPC listening: http://localhost:${config.xml_rpc_port}`, __filename);
});
xmlRpcServer.on("getCurrentTemperature", getCurrentTemperature);
