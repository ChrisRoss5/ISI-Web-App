import { config } from "utils/config";
import xmlrpc from "xmlrpc";

export default xmlrpc.createClient({
  host: "localhost",
  port: config.xml_rpc_port,
  path: "/",
});
