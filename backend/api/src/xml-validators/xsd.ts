import { NextFunction, Request, Response } from "express";
import path from "path";
import * as validator from "xsd-schema-validator";
import * as convert from "xml-js";

export default function validateRequestXMLWithXSD() {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.file) throw new Error("No file provided");

      const fileString = req.file.buffer.toString();
      const schemaPath = path.resolve(__dirname, "schema.xsd");
      const result = await validator.validateXML(fileString, schemaPath);
      console.log(result);

      if (!result.valid) {
        res.status(400);
        throw new Error("XML Errors: " + result.messages.join(", "));
      }

      const xml = convert.xml2js(fileString, { compact: true });
      const { resource } = xml as any;
      for (const key in resource) {
        if (resource[key]._text) {
          const value = resource[key]._text;
          resource[key] = isNaN(Number(value)) ? value : Number(value);
        }
      }
      req.body = resource;
      console.log("RESOURCE: ", resource);

      next();
    } catch (error) {
      next(error);
    }
  };
}
