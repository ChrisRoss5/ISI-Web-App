import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import api from "./api";
import MessageResponse from "./interfaces/MessageResponse";
import * as middlewares from "./middlewares";
import soapService from "./services/soapService";
import * as soap from "soap";
import fs from "fs";

const app = express();

const soapXml = fs.readFileSync("src/services/search.wsdl", "utf8");
soap.listen(app, "/soap", soapService, soapXml, () => {
  console.log(
    "SOAP service is running. Listening on /soap. WSDL is available at /soap?wsdl"
  );
});

app.use(morgan("dev"));
app.use(helmet());
app.use(cors());
/* app.use(express.json());
app.use(cookieParser());

app.use(middlewares.deserializeUser);

app.get<{}, MessageResponse>("/", (req, res) => {
  res.json({
    message: "Welcome to the backend!",
  });
});

app.use("/api/v1", api);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler); */

export default app;
