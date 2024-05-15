import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import fs from "fs";
import helmet from "helmet";
import morgan from "morgan";
import * as soap from "soap";
import xmlrpc from "xmlrpc";
import api from "./api/rest";
import soapService from "./api/soap/soapService";
import getCurrentTemperature from "./api/xml-rpc/getCurrentTemperature";
import * as middlewares from "./middlewares";
import { config } from "./utils/config";

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
  console.log(`REST listening: http://localhost:${config.rest_port}/api/rest`);
});

const soapApp = express();
const soapXml = fs.readFileSync("src/api/soap/search.wsdl", "utf8");
soap.listen(soapApp, "/api/soap", soapService, soapXml, () => {
  const url = `http://localhost:${config.soap_port}/api/soap`;
  console.log(`SOAP listening: ${url}`);
  console.log(`SOAP WSDL available at ${url}?wsdl`);
});
soapApp.use(cors());
soapApp.listen(config.soap_port);

const xmlRpcServer = xmlrpc.createServer({ port: config.xml_rpc_port }, () => {
  console.log(`XML-RPC listening: http://localhost:${config.xml_rpc_port}`);
});
xmlRpcServer.on("getCurrentTemperature", getCurrentTemperature);
