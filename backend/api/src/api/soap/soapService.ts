import * as dom from "@xmldom/xmldom";
import fs from "fs";
import * as convert from "xml-js";
import * as xpath from "xpath";
import { db } from "../../db";
import { xml2js } from "../../utils/xml2js";
import path from "path";

const parser = new dom.DOMParser();

const service = {
  SearchService: {
    SearchServiceSoapPort: {
      Search: async (args: { searchTerm: string; searchProperty?: string }) => {
        console.log("SOAP called with args: ", args);
        const { searchTerm, searchProperty } = args;
        const resources = await db.resource.findMany();
        const xml = convert.js2xml(
          { resources: { resource: resources } },
          { compact: true }
        );
        fs.writeFileSync(
          path.join(process.cwd(), "/src/xml-validators/xsd-jaxb/task3.xml"),
          xml
        );

        const doc = parser.parseFromString(xml, "text/xml");
        const expression = searchProperty
          ? `//resource[${searchProperty}[contains(., '${searchTerm}')]]`
          : `//resource[contains(., '${searchTerm}')]`;
        const searchedResources = xpath.select(expression, doc);
        if (!Array.isArray(searchedResources)) return [];
        const result = searchedResources.map((r) => xml2js(r.toString()));

        return { resource: result };
      },
    },
  },
};

export default service;
