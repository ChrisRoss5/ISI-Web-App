import { NextFunction, Request, Response } from "express";
import fs from "fs";
import path from "path";
import log from "utils/logger";
import { xml2js } from "utils/xml2js";
import validate from "../exec";

/*
https://relaxng.org/jclark/jing.html

jing.jar built from:
https://github.com/relaxng/jing-trang
 */

export default function validateRequestXMLWithRNG() {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.file) throw new Error("No file provided");

      log("Validating XML with RNG", __filename);

      const fileString = req.file.buffer.toString();
      const jarPath = path.resolve(__dirname, "jing.jar");
      const schemaPath = path.resolve(__dirname, "rng-schema.rng");
      const tempFilePath = path.resolve(__dirname, "temp.xml");
      fs.writeFileSync(tempFilePath, fileString);
      const command = `java -jar "${jarPath}" "${schemaPath}" "${tempFilePath}"`;

      const result = await validate(command);
      log(`Validation ${result.valid ? "successful" : "failed"}`, __filename);

      fs.unlinkSync(tempFilePath);
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
