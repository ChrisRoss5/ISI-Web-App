package dev.k1k1;

import dev.k1k1.model.Resources;
import org.xml.sax.SAXException;
import org.xml.sax.helpers.DefaultHandler;

import javax.xml.XMLConstants;
import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBException;
import javax.xml.bind.Marshaller;
import javax.xml.validation.Schema;
import javax.xml.validation.SchemaFactory;
import java.io.File;

public class XmlValidatorAgainstXSDusingJAXB {

    public static void main(String[] args) {
        String schemaPath = args[0];
        String xmlPath = args[1];

        // https://stackoverflow.com/a/1564795/10264782
        try {
            SchemaFactory schemaFactory = SchemaFactory.newInstance(XMLConstants.W3C_XML_SCHEMA_NS_URI);
            Schema schema = schemaFactory.newSchema(new File(schemaPath));

            JAXBContext jaxbContext = JAXBContext.newInstance(Resources.class);

            Marshaller marshaller = jaxbContext.createMarshaller();
            marshaller.setSchema(schema);

            Object objectToMarshal = jaxbContext.createUnmarshaller().unmarshal(new File(xmlPath));

            marshaller.marshal(objectToMarshal, new DefaultHandler());
        } catch (SAXException | JAXBException e) {
            System.out.println("Validation error: " + e);
        }
    }

}
