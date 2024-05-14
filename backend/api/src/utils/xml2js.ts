import { Resource } from "@prisma/client";
import * as convert from "xml-js";

export function xml2js(xml: string): Resource {
  const xmlConverted = convert.xml2js(xml, { compact: true });
  const { resource } = xmlConverted as any;
  for (const key in resource) {
    if (resource[key]._text) {
      const value = resource[key]._text;
      resource[key] = isNaN(Number(value)) ? value : Number(value);
    }
  }
  return resource;
}