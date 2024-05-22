import { NextFunction, Request, Response } from "express";
import log from "utils/logger";
import xmlRpcClient from "../xml-rpc/client";

export default async function getCurrentTemperature(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    log(
      "Getting current temperature by calling XML-RPC service from REST API",
      __filename
    );

    const { city } = req.query;

    xmlRpcClient.methodCall("getCurrentTemperature", [city], (error, value) => {
      if (error) res.json("City not found");
      else
        res.json(
          value.temperatures.map(
            (value: { cityName: string; temperature: string }) =>
              `Current temperature in ${value.cityName}: ${value.temperature}°C`
          )
        );
    });
  } catch (error) {
    next(error);
  }
}
