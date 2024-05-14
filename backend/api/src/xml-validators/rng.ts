import { exec } from "child_process";
import { NextFunction, Request, Response } from "express";
import fs from "fs"; // Import the 'fs' module
import path from "path";
import * as convert from "xml-js";

/*
https://relaxng.org/jclark/jing.html
https://relaxng.org/tutorial-20030326.html
 */

export default function validateRequestXMLWithRNG() {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.file) throw new Error("No file provided");

      console.log("Validating XML with RNG");

      const fileString = req.file.buffer.toString();
      const jingPath = path.resolve(__dirname, "jing.jar");
      const schemaPath = path.resolve(__dirname, "rng-schema.rng");
      const tempFilePath = path.resolve(__dirname, "temp.xml");
      fs.writeFileSync(tempFilePath, fileString);
      const command = `java -jar "${jingPath}" "${schemaPath}" "${tempFilePath}`;

      const result = await validateXMLWithRNG(command);
      fs.unlinkSync(tempFilePath);
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

      next();
    } catch (error) {
      next(error);
    }
  };
}

async function validateXMLWithRNG(
  command: string
): Promise<{ valid: boolean; messages: string[] }> {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      console.log("ERROR: ", error, !!error);
      console.log("STDOUT: ", stdout, !!stdout);
      console.log("STDERR: ", stderr, !!stderr);
      resolve({
        valid: !error && !stdout && !stderr,
        messages: [stdout],
      });
    });
  });
}