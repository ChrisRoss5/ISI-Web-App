import { NextFunction, Request, Response } from "express";
import path from "path";
import * as validator from "xsd-schema-validator";
import { xml2js } from "../../utils/xml2js";
import log from "utils/logger";

/* https://www.npmjs.com/package/xsd-schema-validator */

export default function validateRequestXMLWithXSD() {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.file) throw new Error("No file provided");

      log("Validating XML with XSD", __filename);
      const fileString = req.file.buffer.toString();
      const schemaPath = path.resolve(__dirname, "xsd-schema.xsd");

      const result = await validator.validateXML(fileString, schemaPath);
      log(`Validation ${result.valid ? "successful" : "failed"}`, __filename);

      if (!result.valid) {
        res.status(400);
        throw new Error("XML Errors: " + result.messages.join(", "));
      }

      req.body = xml2js(fileString);

      next();
    } catch (error) {
      next(error);
    }
  };
}
