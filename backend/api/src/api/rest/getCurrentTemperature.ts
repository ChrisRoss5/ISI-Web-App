import { NextFunction, Request, Response } from "express";
import xmlRpcClient from "../xml-rpc/client";

export default async function getCurrentTemperature(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    console.log(
      "Getting current temperature by calling XML-RPC service from REST API"
    );

    const { city } = req.query;

    xmlRpcClient.methodCall("getCurrentTemperature", [city], (error, value) => {
      if (error) throw error;
      res.json(
        `Current temperature in ${value.cityName}: ${value.temperature}°C`
      );
    });
  } catch (error) {
    next(error);
  }
}
