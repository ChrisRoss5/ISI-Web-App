import { NextFunction, Request, Response } from "express";
import fs from "fs";
import path from "path";
import log from "utils/logger";
import validate from "../exec";

export default async function checkGeneratedXMLfileAgainstXSDusingJAXB(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    log(
      "Validating XML generated from the SOAP service with XSD using JAXB",
      __filename
    );

    const task3Path = path.resolve(__dirname, "task3.xml");
    if (!fs.existsSync(task3Path)) {
      res.status(404);
      return next(
        new Error(
          "XML file not found. Please call the SOAP service first (Task 3)."
        )
      );
    }

    const jarPath = path.resolve(
      __dirname,
      "XmlValidatorAgainstXSDusingJAXB.jar"
    );
    const schemaPath = path.resolve(__dirname, "xsd-schema.xsd");
    const command = `java -jar "${jarPath}" "${schemaPath}" "${task3Path}"`;
    const result = await validate(command);
    log(`Validation ${result.valid ? "successful" : "failed"}`, __filename);

    if (!result.valid) {
      res.status(400);
      throw new Error("XML Errors: " + result.messages.join(", "));
    }
    fs.unlinkSync(task3Path);

    res.json("XML is valid against XSD using JAXB and is now deleted.");
  } catch (error) {
    next(error);
  }
}
