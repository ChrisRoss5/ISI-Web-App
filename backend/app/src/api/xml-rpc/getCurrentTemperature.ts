import log from "utils/logger";
import { xml2js } from "xml-js";
import xmlrpc from "xmlrpc";

const getCurrentTemperature: xmlrpc.ServerFunction = async (
  err,
  params,
  callback
) => {
  log("XML-RPC server function called", __filename);

  const searchedCityName = params[0] || "Slavonski Brod";
  const response = await fetch("https://vrijeme.hr/hrvatska_n.xml");
  const xml = await response.text();
  const weather = xml2js(xml, { compact: true }) as any;

  const cities = weather.Hrvatska.Grad;

  console.log("SEARCING:", searchedCityName);

  const filteredCities = cities.filter((c: any) => {
    const cityName = c.GradIme._text.toLowerCase();
    return cityName.includes(searchedCityName.toLowerCase());
  });

  if (!filteredCities.length) {
    callback(`Not found`, "City not found");
    return;
  }

  const temperatures = filteredCities.map((city: any) => {
    return {
      cityName: city.GradIme._text,
      temperature: city.Podatci.Temp._text,
    };
  });

  callback(null, { temperatures });
};

export default getCurrentTemperature;
