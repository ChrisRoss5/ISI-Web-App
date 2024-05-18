import * as dom from "@xmldom/xmldom";
import fs from "fs";
import * as convert from "xml-js";
import * as xpath from "xpath";
import { db } from "../../db";
import { xml2js } from "../../utils/xml2js";
import path from "path";
import log from "utils/logger";

const parser = new dom.DOMParser();

const service = {
  SearchService: {
    SearchServiceSoapPort: {
      Search: async (args: { searchTerm: string; searchProperty?: string }) => {
        log("SOAP service called", __filename);

        const { searchTerm, searchProperty } = args;
        const resources = await db.resource.findMany();
        const xml = convert.js2xml(
          { resources: { resource: resources } },
          { compact: true }
        );
        const dest = path.join(process.cwd(), "/src/xml-validators/xsd-jaxb");
        fs.writeFileSync(dest, xml);
        log("XML file written at " + dest, __filename);

        const doc = parser.parseFromString(xml, "text/xml");
        const expression = searchProperty
          ? `//resource[${searchProperty}[contains(., '${searchTerm}')]]`
          : `//resource[contains(., '${searchTerm}')]`;
        const searchedResources = xpath.select(expression, doc);
        const isFound = Array.isArray(searchedResources);
        log(
          `Matching resources found: ${isFound ? searchedResources.length : 0}`,
          __filename
        );

        if (!isFound) return [];
        const result = searchedResources.map((r) => xml2js(r.toString()));

        return { resource: result };
      },
    },
  },
};

export default service;
