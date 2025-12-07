import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
// import {HighLevel} from '@gohighlevel/api-client'

import { z } from 'zod';
import axios from 'axios';
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";

// -------------------- Create MCP Server --------------------
const server = new McpServer({
    name: 'GHL_MCP_Server',
    version: '1.0.0'
});

// -------------------- Zod Schema --------------------
const AddContactSchema = z.object({
    apiKey: z.string().min(1, "API key is required"),
    locationId: z.string().min(1, "Location ID is required"),
    contact: z.object({
        name: z.string().min(1, "Contact name is required"),
        email: z.string().email("Valid email is required").optional().or(z.literal("")),
        // phone: z.string().optional(),
        // company: z.string().optional(),
        // website: z.string().optional(),
        // address: z.object({
        //     street: z.string().optional(),
        //     city: z.string().optional(),
        //     state: z.string().optional(),
        //     postalCode: z.string().optional(),
        //     country: z.string().optional()
        // }).optional()
    })
});

// -------------------- Register Tool --------------------
server.registerTool(
    'add_contact',
    {
        title: 'Get contact info',
        description: 'Receives info and send back info.',
        inputSchema: z.object({
            apiKey: z.string(),
            locationId: z.string(),
            contact: z.object({
              name: z.string(),
              email: z.string().optional(),
            //   phone: z.string().optional()
            })
          }),
          outputSchema: z.object({
            success: z.boolean(),
            data: z.any()
          })        
    },
    async (input) => {
        const { apiKey, locationId, contact } = input;
    
        console.log("Received data:", apiKey, locationId, contact);
        
        /*
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: 'https://services.leadconnectorhq.com/contacts/?locationId=eKlKYR6vdxwBnCFOUy5l',
            headers: { 
              'Accept': 'application/json', 
              'Version': '2021-07-28', 
              'Authorization': 'Bearer pit-636b17a0-7085-4d28-8705-f3c1a06cc9d9'
            }
          };
          
          axios.request(config)
          .then((response) => {
            console.log(JSON.stringify(response.data));
          })
          .catch((error) => {
            console.log(error);
          });
          */

        /*
          let data = JSON.stringify({
            "firstName": "Rosan",
            "lastName": "Deo",
            "name": "Rosan Deo",
            "email": "rosan@deos1.com",
            "locationId": "eKlKYR6vdxwBnCFOUy5l",
            "gender": "male",
            "phone": "+1 888-888-8888",
            "address1": "3535 1st St N",
            "city": "Dolomite",
            "state": "AL",
            "postalCode": "35061",
            "website": "https://www.tesla.com",
            "timezone": "America/Chihuahua",
            "dnd": true,
            "dndSettings": {
              "Call": {
                "status": "active",
                "message": "string",
                "code": "string"
              },
              "Email": {
                "status": "active",
                "message": "string",
                "code": "string"
              },
              "SMS": {
                "status": "active",
                "message": "string",
                "code": "string"
              },
              "WhatsApp": {
                "status": "active",
                "message": "string",
                "code": "string"
              },
              "GMB": {
                "status": "active",
                "message": "string",
                "code": "string"
              },
              "FB": {
                "status": "active",
                "message": "string",
                "code": "string"
              }
            },
            "inboundDndSettings": {
              "all": {
                "status": "active",
                "message": "string"
              }
            },
            "tags": [
              "nisi sint commodo amet",
              "consequat"
            ],
            "customFields": [
              {
                "id": "6dvNaf7VhkQ9snc5vnjJ",
                "key": "my_custom_field",
                "field_value": "My Text"
              },
              {
                "id": "6dvNaf7VhkQ9snc5vnjJ",
                "key": "my_custom_field",
                "field_value": "My Text"
              },
              {
                "id": "6dvNaf7VhkQ9snc5vnjJ",
                "key": "my_custom_field",
                "field_value": "My Selected Option"
              },
              {
                "id": "6dvNaf7VhkQ9snc5vnjJ",
                "key": "my_custom_field",
                "field_value": "My Selected Option"
              },
              {
                "id": "6dvNaf7VhkQ9snc5vnjJ",
                "key": "my_custom_field",
                "field_value": 100
              },
              {
                "id": "6dvNaf7VhkQ9snc5vnjJ",
                "key": "my_custom_field",
                "field_value": 100.5
              },
              {
                "id": "6dvNaf7VhkQ9snc5vnjJ",
                "key": "my_custom_field",
                "field_value": [
                  "test",
                  "test2"
                ]
              },
              {
                "id": "6dvNaf7VhkQ9snc5vnjJ",
                "key": "my_custom_field",
                "field_value": [
                  "test",
                  "test2"
                ]
              },
              {
                "id": "6dvNaf7VhkQ9snc5vnjJ",
                "key": "my_custom_field",
                "field_value": {
                  "f31175d4-2b06-4fc6-b7bc-74cd814c68cb": {
                    "meta": {
                      "fieldname": "1HeGizb13P0odwgOgKSs",
                      "originalname": "IMG_20231215_164412935.jpg",
                      "encoding": "7bit",
                      "mimetype": "image/jpeg",
                      "size": 1786611,
                      "uuid": "f31175d4-2b06-4fc6-b7bc-74cd814c68cb"
                    },
                    "url": "https://services.leadconnectorhq.com/documents/download/w2M9qTZ0ZJz8rGt02jdJ",
                    "documentId": "w2M9qTZ0ZJz8rGt02jdJ"
                  }
                }
              }
            ],
            "source": "public api",
            "dateOfBirth": "1990-09-25",
            "country": "US",
            "companyName": "DGS VolMAX",
            "assignedTo": "y0BeYjuRIlDwsDcOHOJo"
          });

          */
          const data = {
            firstName: contact.name,
            lastName: "",
            email: contact.email,
            locationId: locationId,
            // phone: "+18888888888",
            
          };
          




          
          let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://services.leadconnectorhq.com/contacts/',
            headers: { 
              'Content-Type': 'application/json', 
              'Accept': 'application/json', 
              'Version': '2021-07-28', 
            //   'Authorization': `Bearer pit-636b17a0-7085-4d28-8705-f3c1a06cc9d9`
              'Authorization': `Bearer ${apiKey}`
            },
            data : data
          };
          
          axios.request(config)
          .then((response) => {
            console.log(JSON.stringify(response.data));
          })
          .catch((error) => {
            console.log(error);
          });




        return {
            content: [{ type: "text", text: "Successfully added" }],
            structuredContent: {
              success: true,
              data: { apiKey, locationId, contact }
            }
        };


        /*
        try {
            const url = 'https://services.leadconnectorhq.com/contacts/';
            const contactData = {
                name: "John Doe",
                email: "john@example.com",
                locationId: 'eKlKYR6vdxwBnCFOUy5l'
              };
  
            const response = await fetch(url, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': ""
              },
              body: JSON.stringify(contactData)
            });
          
            if (!response.ok) {
                console.log("Erro response:", response)
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            return {
                content: [{ type: "text", text: "Successfully added" }],
                structuredContent: {
                  success: true,
                  data: { apiKey, locationId, contact }
                }
            };



          
            return await response.json();           
        } catch (error) {
            console.error('Error:', error);
            return {
                content: [{ type: "text", text: "Unsuccessful attempt" }],
                structuredContent: {
                  success: false,
                  data: { apiKey, locationId, contact }
                }
            };




        }
        */


    
        // return {
        //     content: [{ type: 'text', text: "Successfully added" }],
        //     structuredContent:  { type: 'text', text: "Successfully added" }
        // };


        // return {
        //     content: [{ type: "text", text: "Successfully added" }],
        //     structuredContent: {
        //       success: true,
        //       data: { apiKey, locationId, contact }
        //     }
        // };
    }
    
);

server.registerTool('add', {
    title: 'Addition Tool',
    description: 'Add two numbers',
    inputSchema: { a: z.number(), b: z.number() },
    outputSchema: { result: z.number() }
}, async ({ a, b }) => {
    console.log("Add tool called!")
    const output = { result: (a + b) };
    return {
        content: [{ type: 'text', text: JSON.stringify(output) }],
        structuredContent: output
    };
});

// -------------------- Express Setup --------------------
const app = express();
app.use(express.json());

// MCP endpoint
app.post('/mcp', async (req, res) => {
    console.log("MCP endpoint accessed");
    // console.log("Request body:", JSON.stringify(req.body, null, 2));
    
    const transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: undefined,
        enableJsonResponse: true
    });

    res.on('close', () => {
        console.log("Response closed, cleaning up transport");
        transport.close();
    });

    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);
});

// Health Check
app.get('/', (req, res) => {
    console.log("Default root accessed!")
    res.status(200).json({
        message: 'GHL MCP Server is running',
        version: '1.0.0',
        endpoints: {
            mcp: '/mcp',
            health: '/'
        }
    });
});

// -------------------- Start Server --------------------
const port = parseInt(process.env.PORT || '3001', 10);
app.listen(port, () => {
    console.log(`GHL MCP Server running at http://localhost:${port}/mcp`);
});