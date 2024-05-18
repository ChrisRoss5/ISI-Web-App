import log from "utils/logger";
import { xml2js } from "xml-js";
import xmlrpc from "xmlrpc";

const getCurrentTemperature: xmlrpc.ServerFunction = async (
  err,
  params,
  callback
) => {
  log("XML-RPC server function called", __filename);

  const cityName = params[0] || "Slavonski Brod";
  const response = await fetch("https://vrijeme.hr/hrvatska_n.xml");
  const xml = await response.text();
  const weather = xml2js(xml, { compact: true }) as any;

  const cities = weather.Hrvatska.Grad;
  const city = cities.find((c: any) => c.GradIme._text == cityName);
  const temperature = city.Podatci.Temp._text;

  callback(null, { cityName, temperature });
};

export default getCurrentTemperature;
