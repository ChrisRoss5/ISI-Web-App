package dev.k1k1;

import com.sun.tools.xjc.Driver;
import java.io.File;
import java.net.URL;
import java.net.URLClassLoader;

// DOES NOT WORK WITH jaxb-runtime

public class XsdToJava {

    public static void main(String[] args) {
        String xsdPath = "src/main/java/dev/k1k1/xsd-schema.xsd";
        String outputPath = "src/main/java";
        String packageName = "dev.k1k1.model";

        File schemaFile = new File(xsdPath);
        File outputDir = new File(outputPath);

        if (!outputDir.exists()) {
            outputDir.mkdirs();
        }

        try {
            String[] xjcArgs = {
                    "-d", outputDir.getAbsolutePath(),
                    "-p", packageName,
                    schemaFile.getAbsolutePath()
            };

            ClassLoader oldClassLoader = Thread.currentThread().getContextClassLoader();
            URLClassLoader urlClassLoader = new URLClassLoader(
                    new URL[] {new File(System.getProperty("java.home") + "/../lib/tools.jar").toURI().toURL()},
                    oldClassLoader
            );
            Thread.currentThread().setContextClassLoader(urlClassLoader);

            Driver.run(xjcArgs, System.out, System.out);
            Thread.currentThread().setContextClassLoader(oldClassLoader);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

}
