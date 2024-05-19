## ISI (Information System Interoperability) Web App

This web app consists of 7 tasks organized according to the [assignment PDF](EN_Description_of_project_assignment.pdf).

#### How to explore tasks 1 by 1 with Docker:

The only requirement is to have Docker Desktop installed:  
https://www.docker.com/products/docker-desktop/

1. Run `docker compose up` in the root directory
2. Open http://localhost:5173 in your browser (my frontend with tasks 1-7)
3. Open http://localhost:5003 in your browser (Prisma studio)
4. Open Docker Desktop > Containers > isi-web-app-backend > Logs
5. Some REST API endpoints require authorization.  
   Skip to task 6 and register or login with the following credentials:
   - Username: `a@a.hr`
   - Password: `test123`
6. Return to task 1 and try uploading XML files from [xml-upload-examples](xml-upload-examples)
7. Explore Logs in the Docker Desktop as well as the Prisma studio to see the uploaded data
8. Repeat with task 2
9. In tasks 3 and 4, observe the logs and go to Container Files to see file generation
10. Modify the generated file inside Docker, and repeat task 4
11. Finish with task 5

#### Components:

- [backend/app](backend/app) - a Node.js (v20) app running 4 servers:
  - REST server (port: 5000)
    - https://www.npmjs.com/package/express
  - SOAP server (port: 5001):
    - https://www.npmjs.com/package/soap
  - XML-RPC server (port: 5002):
    - https://www.npmjs.com/package/xmlrpc
  - Prisma studio server (port: 5003):
    - https://www.npmjs.com/package/prisma
- [backend/XMLValidatorAgainstXSDusingJAXB](backend/XMLValidatorAgainstXSDusingJAXB) - a self-explanatory Java (v21) app.
  - Its purpose is to create an artifact (.jar) to be run by the Node.js app via `java -jar` command.
- [frontend](frontend) - a Vue.js app (port: 5173)

#### XML (Extensible Markup Language) validators:

- XSD (XML Schema Definition)
  - https://www.npmjs.com/package/xsd-schema-validator
- RNG (RelaxNG)
  - https://github.com/relaxng/jing-trang
- XSD-JAXB (Java Architecture for XML Binding)
  - My implementation: [backend/XMLValidatorAgainstXSDusingJAXB](backend/XMLValidatorAgainstXSDusingJAXB)
